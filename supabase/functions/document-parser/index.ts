// Supabase Edge Function: Document Parser per Samo L-22
// Estrae testo da PDF e immagini, crea chunks per retrieval
// Deno runtime - deployed via Supabase CLI

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const OPENAI_API_KEY          = Deno.env.get('OPENAI_API_KEY') ?? ''
const SUPABASE_URL            = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  job_id: string
  material_id: string
  file_url: string
  file_name: string
  file_mime: string
}

// Chunking del testo: divide in pezzi da ~800 token (≈600 parole)
function chunkText(text: string, chunkSize = 600): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim().length > 50) {
      chunks.push(chunk.trim())
    }
  }
  return chunks.length > 0 ? chunks : [text.slice(0, 2000)]
}

// Stima token count (approssimazione: 1 token ≈ 4 caratteri)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Estrai testo da PDF o immagine usando OpenAI Vision
async function extractTextFromFile(
  fileUrl: string,
  fileName: string,
  fileMime: string
): Promise<string> {
  const isImage = fileMime.startsWith('image/')
  const isPdf   = fileMime === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')

  let userContent: any[]

  if (isImage) {
    userContent = [
      {
        type: 'text',
        text: 'Estrai tutto il testo presente in questa immagine. Includi tutti i contenuti testuali, tabelle, formule, ecc. Rispondi solo con il testo estratto, senza commenti.',
      },
      {
        type: 'image_url',
        image_url: { url: fileUrl, detail: 'high' },
      },
    ]
  } else if (isPdf) {
    // Per PDF usiamo GPT-4o con URL del file (se accessibile) oppure richiediamo summary
    userContent = [
      {
        type: 'text',
        text: `Questo è il riferimento a un documento PDF: ${fileName} (URL: ${fileUrl}).\n\nSe riesci ad accedere al contenuto del file, estrai e trascrivi tutto il testo. Altrimenti, indica "ACCESSO_NEGATO" e descriveremo il contenuto manualmente.\n\nSe il PDF è un materiale di studio universitario di Scienze Motorie, estrai tutto il testo strutturandolo per sezioni.`,
      },
    ]
  } else {
    // Altri tipi di file (testo, slide come testo)
    userContent = [
      {
        type: 'text',
        text: `Descrivi il contenuto del file ${fileName} come materiale di studio universitario. URL: ${fileUrl}`,
      },
    ]
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un assistente specializzato nell\'estrazione e trascrizione di testo da documenti universitari di Scienze Motorie. Estrai il testo fedelmente, preservando la struttura.',
        },
        { role: 'user', content: userContent },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI extraction error: ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// Rileva il topic principale di un chunk
async function detectTopic(chunk: string, fileName: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un classificatore di argomenti universitari di Scienze Motorie. Rispondi con UN SOLO argomento/topic (2-5 parole max) che descrive il contenuto del testo fornito.',
        },
        {
          role: 'user',
          content: `Documento: ${fileName}\n\nTesto:\n${chunk.slice(0, 500)}\n\nQual è l'argomento principale? Rispondi solo con il topic (es: "Anatomia muscoli spalla", "Fisiologia cardiaca", "Biomeccanica corsa").`,
        },
      ],
      max_tokens: 20,
      temperature: 0.2,
    }),
  })

  if (!response.ok) return 'Argomento non rilevato'
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? 'Generico'
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
    const { job_id, material_id, file_url, file_name, file_mime } = body

    // Aggiorna job a "processing"
    await supabase
      .from('ai_jobs')
      .update({ status: 'processing', started_at: new Date().toISOString(), progress: 10 })
      .eq('id', job_id)
      .eq('user_id', user.id)

    // Verifica limiti utilizzo
    const { data: canProceed } = await supabase.rpc('increment_ai_usage', {
      p_user_id: user.id,
      p_type: 'parse',
    })

    // Estrai testo dal file
    await supabase.from('ai_jobs').update({ progress: 25 }).eq('id', job_id)
    const extractedText = await extractTextFromFile(file_url, file_name, file_mime)

    if (!extractedText || extractedText.length < 50) {
      await supabase.from('ai_jobs').update({
        status: 'failed',
        error_message: 'Impossibile estrarre testo dal documento. Il file potrebbe essere protetto o non leggibile.',
        progress: 100,
        completed_at: new Date().toISOString(),
      }).eq('id', job_id)
      return new Response(
        JSON.stringify({ error: 'Testo non estratto' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('ai_jobs').update({ progress: 50 }).eq('id', job_id)

    // Chunking del testo
    const chunks = chunkText(extractedText)

    // Elimina chunks precedenti per questo materiale
    await supabase.from('material_chunks').delete().eq('material_id', material_id)

    // Inserisci chunks con topic detection
    const chunksToInsert = []
    for (let i = 0; i < chunks.length; i++) {
      const chunk   = chunks[i]
      const topic   = chunks.length > 3 ? await detectTopic(chunk, file_name) : file_name

      chunksToInsert.push({
        material_id,
        user_id: user.id,
        chunk_index: i,
        content: chunk,
        token_count: estimateTokens(chunk),
        topic,
        page_ref: `Sezione ${i + 1}`,
      })

      // Aggiorna progresso
      const progress = 50 + Math.floor((i / chunks.length) * 40)
      await supabase.from('ai_jobs').update({ progress }).eq('id', job_id)
    }

    await supabase.from('material_chunks').insert(chunksToInsert)

    // Salva output
    await supabase.from('ai_outputs').insert({
      job_id,
      user_id: user.id,
      output_type: 'parsed_chunks',
      content: { chunks_count: chunks.length, topics: [...new Set(chunksToInsert.map(c => c.topic))] },
      content_text: extractedText.slice(0, 1000),
      metadata: { file_name, file_mime, total_tokens: estimateTokens(extractedText) },
    })

    // Aggiorna job a completato
    await supabase.from('ai_jobs').update({
      status: 'completed',
      progress: 100,
      completed_at: new Date().toISOString(),
    }).eq('id', job_id)

    return new Response(
      JSON.stringify({
        success: true,
        chunks_count: chunks.length,
        topics: [...new Set(chunksToInsert.map(c => c.topic))],
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Document Parser Error:', error)
    return new Response(
      JSON.stringify({ error: 'Errore interno nel parsing del documento', detail: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
