// Supabase Edge Function: Document Q&A (RAG-like) per Samo L-22
// Risponde a domande sui documenti usando i chunks estratti
// Deno runtime - deployed via Supabase CLI

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const OPENAI_API_KEY            = Deno.env.get('OPENAI_API_KEY') ?? ''
const SUPABASE_URL              = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  question: string
  material_ids: string[]       // uno o più materiali da interrogare
  conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

interface ChunkWithScore {
  id: string
  content: string
  topic: string
  page_ref: string
  chunk_index: number
  score: number
}

// Ricerca semantica semplice tramite keyword matching (fallback senza pgvector)
function scoreChunk(chunk: string, question: string): number {
  const questionWords = question.toLowerCase().split(/\W+/).filter(w => w.length > 3)
  const chunkLower   = chunk.toLowerCase()
  let score = 0
  for (const word of questionWords) {
    const count = (chunkLower.match(new RegExp(word, 'g')) || []).length
    score += count
  }
  // Bonus per frasi esatte
  if (chunkLower.includes(question.toLowerCase().slice(0, 30))) score += 5
  return score
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const token    = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()
    const { question, material_ids, conversation_history = [] } = body

    if (!question?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Domanda mancante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Incrementa utilizzo Q&A
    await supabase.rpc('increment_ai_usage', { p_user_id: user.id, p_type: 'qa' })

    // Recupera chunks dai materiali selezionati
    let query = supabase
      .from('material_chunks')
      .select('id, content, topic, page_ref, chunk_index, material_id')
      .eq('user_id', user.id)

    if (material_ids?.length > 0) {
      query = query.in('material_id', material_ids)
    }

    const { data: chunks, error: chunksError } = await query.limit(100)

    if (chunksError || !chunks?.length) {
      // Nessun chunk trovato — chiedi di effettuare il parsing
      return new Response(
        JSON.stringify({
          answer: 'Non ho trovato contenuti estratti dai tuoi materiali. Assicurati di aver eseguito il parsing del documento prima di fare domande. Puoi farlo dalla pagina AI Studio > Genera > seleziona un materiale.',
          citations: [],
          topics_covered: [],
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Scoring e selezione top-5 chunks rilevanti
    const scoredChunks: ChunkWithScore[] = chunks.map((c: any) => ({
      id: c.id,
      content: c.content,
      topic: c.topic || 'Generico',
      page_ref: c.page_ref || `Sezione ${c.chunk_index + 1}`,
      chunk_index: c.chunk_index,
      score: scoreChunk(c.content, question),
    }))

    const topChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    // Recupera info materiali per le citazioni
    const materialIds = [...new Set(chunks.map((c: any) => c.material_id))]
    const { data: materials } = await supabase
      .from('study_materials')
      .select('id, name, file_type')
      .in('id', materialIds)
      .eq('user_id', user.id)

    const materialMap: Record<string, string> = {}
    materials?.forEach((m: any) => { materialMap[m.id] = m.name })

    // Costruisci contesto per l'AI
    const contextParts = topChunks.map((c, i) =>
      `[Fonte ${i + 1} - ${c.topic} - ${c.page_ref}]:\n${c.content}`
    )
    const contextText = contextParts.join('\n\n---\n\n')

    // Build messages
    const messages = [
      {
        role: 'system',
        content: `Sei Samo, un assistente AI esperto di Scienze Motorie (L-22). Il tuo compito è rispondere alle domande degli studenti basandoti ESCLUSIVAMENTE sui contenuti dei loro documenti di studio.

Regole:
- Rispondi SOLO in italiano
- Basa le risposte sui testi forniti come "Fonte"
- Cita sempre le fonti usando [Fonte N] nel testo
- Se la risposta non è nei documenti, dillo chiaramente
- Usa markdown per formattare la risposta (elenchi, grassetto)
- Sii preciso ma accessibile

Documenti disponibili:
${contextText}`,
      },
      ...conversation_history.map((m) => ({ role: m.role, content: m.content })),
      {
        role: 'user',
        content: question,
      },
    ]

    // Chiama OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1200,
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text()
      throw new Error(`OpenAI error: ${errText}`)
    }

    const aiData    = await openaiResponse.json()
    const answer    = aiData.choices?.[0]?.message?.content ?? 'Non sono riuscito a elaborare la risposta.'
    const topicsSet = [...new Set(topChunks.map(c => c.topic))]

    // Prepara citazioni
    const citations = topChunks
      .filter(c => c.score > 0)
      .map((c, i) => ({
        source_index: i + 1,
        topic: c.topic,
        page_ref: c.page_ref,
        excerpt: c.content.slice(0, 200) + (c.content.length > 200 ? '...' : ''),
      }))

    return new Response(
      JSON.stringify({ answer, citations, topics_covered: topicsSet }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Document Q&A Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Errore interno',
        answer: 'Oops! Qualcosa è andato storto. Riprova tra un momento! 🐾',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
