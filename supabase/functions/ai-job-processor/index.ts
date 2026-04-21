// Supabase Edge Function: AI Job Processor per Samo L-22
// Gestisce job asincroni: generate_quiz, generate_flashcards, generate_summary
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
  job_type: 'generate_quiz' | 'generate_flashcards' | 'generate_summary'
  material_id?: string
  note_id?: string
  // Quiz params
  num_questions?: number
  difficulty?: 'facile' | 'medio' | 'difficile'
  question_types?: Array<'multiple_choice' | 'true_false' | 'fill_blank'>
  subject_name?: string
  topic?: string
  // Flashcard params
  num_cards?: number
  // Summary params
  summary_level?: 'breve' | 'medio' | 'dettagliato'
}

interface GeneratedQuestion {
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  prompt: string
  options?: string[]
  correct_answer: string
  explanation: string
}

interface GeneratedFlashcard {
  front: string
  back: string
  topic?: string
}

// Recupera il contenuto dal materiale o dalla nota
async function getSourceContent(
  supabase: any,
  userId: string,
  materialId?: string,
  noteId?: string
): Promise<{ content: string; title: string; subjectName: string }> {
  let content = ''
  let title   = 'Documento'
  let subjectName = 'Scienze Motorie'

  if (materialId) {
    // Usa i chunks già estratti
    const { data: chunks } = await supabase
      .from('material_chunks')
      .select('content, topic')
      .eq('material_id', materialId)
      .eq('user_id', userId)
      .order('chunk_index', { ascending: true })
      .limit(20)

    if (chunks?.length) {
      content = chunks.map((c: any) => c.content).join('\n\n')
      title   = chunks[0]?.topic ?? 'Materiale'
    } else {
      // Fallback: prendi il testo dal materiale direttamente
      const { data: material } = await supabase
        .from('study_materials')
        .select('name, description')
        .eq('id', materialId)
        .eq('user_id', userId)
        .single()
      if (material) {
        content = material.description ?? material.name
        title   = material.name
      }
    }
  }

  if (noteId && !content) {
    const { data: note } = await supabase
      .from('notes')
      .select('title, content, subjects(name)')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single()
    if (note) {
      content     = note.content
      title       = note.title
      subjectName = (note.subjects as any)?.name ?? 'Scienze Motorie'
    }
  }

  return { content: content.slice(0, 8000), title, subjectName }
}

// Genera quiz tramite OpenAI
async function generateQuiz(
  content: string,
  title: string,
  subjectName: string,
  numQuestions: number,
  difficulty: string,
  questionTypes: string[],
  topic: string
): Promise<GeneratedQuestion[]> {
  const typesDesc = questionTypes
    .map(t => t === 'multiple_choice' ? 'a risposta multipla (4 opzioni, una corretta)'
            : t === 'true_false'      ? 'vero/falso'
            : 'completamento (___)')
    .join(', ')

  const prompt = `Sei un professore universitario di ${subjectName}. Basandoti sul seguente materiale di studio, genera esattamente ${numQuestions} domande di quiz di livello ${difficulty}.

Tipi di domande da usare: ${typesDesc}

Materiale di studio (argomento: ${topic || title}):
---
${content}
---

Genera le domande in formato JSON valido, rispettando ESATTAMENTE questo schema:
{
  "questions": [
    {
      "type": "multiple_choice",
      "prompt": "Testo della domanda?",
      "options": ["A) Prima opzione", "B) Seconda opzione", "C) Terza opzione", "D) Quarta opzione"],
      "correct_answer": "A) Prima opzione",
      "explanation": "Spiegazione dettagliata di perché questa è la risposta corretta, con riferimento al materiale."
    },
    {
      "type": "true_false",
      "prompt": "Affermazione vera o falsa?",
      "options": ["Vero", "Falso"],
      "correct_answer": "Vero",
      "explanation": "Spiegazione..."
    },
    {
      "type": "fill_blank",
      "prompt": "Il muscolo ___ è responsabile di...",
      "options": null,
      "correct_answer": "bicipite brachiale",
      "explanation": "Spiegazione..."
    }
  ]
}

IMPORTANTE: 
- Usa ${difficulty === 'facile' ? 'concetti base e definizioni' : difficulty === 'medio' ? 'applicazione dei concetti' : 'analisi critica e casi complessi'}
- Ogni spiegazione deve essere didattica e aiutare lo studente a capire
- Le domande devono essere basate sul contenuto fornito, non inventate
- Rispondi SOLO con il JSON, nessun altro testo`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un generatore di quiz universitari. Rispondi sempre e solo con JSON valido.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) throw new Error(`OpenAI quiz error: ${await response.text()}`)

  const data    = await response.json()
  const content2 = data.choices?.[0]?.message?.content ?? '{}'
  const parsed  = JSON.parse(content2)
  return parsed.questions ?? []
}

// Genera flashcard tramite OpenAI
async function generateFlashcards(
  content: string,
  title: string,
  subjectName: string,
  numCards: number
): Promise<GeneratedFlashcard[]> {
  const prompt = `Sei un professore universitario di ${subjectName}. Basandoti sul seguente materiale di studio, genera esattamente ${numCards} flashcard per lo studio e la memorizzazione.

Materiale di studio (${title}):
---
${content}
---

Genera le flashcard in formato JSON valido:
{
  "flashcards": [
    {
      "front": "Domanda o concetto da ricordare (fronte della flashcard)",
      "back": "Risposta o definizione completa (retro della flashcard). Può includere punti elenco.",
      "topic": "Argomento specifico"
    }
  ]
}

IMPORTANTE:
- Il fronte deve essere una domanda diretta o un concetto chiave
- Il retro deve essere la risposta completa ma concisa
- Copri i concetti più importanti del materiale
- Rispondi SOLO con il JSON`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un generatore di flashcard universitarie. Rispondi sempre e solo con JSON valido.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2500,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) throw new Error(`OpenAI flashcard error: ${await response.text()}`)

  const data    = await response.json()
  const content2 = data.choices?.[0]?.message?.content ?? '{}'
  const parsed  = JSON.parse(content2)
  return parsed.flashcards ?? []
}

// Genera riassunto tramite OpenAI
async function generateSummary(
  content: string,
  title: string,
  subjectName: string,
  level: string
): Promise<string> {
  const levelDesc =
    level === 'breve'     ? 'un riassunto breve con SOLO bullet points (massimo 10 punti chiave)'
    : level === 'medio'   ? 'un riassunto medio con paragrafi e sezioni (300-500 parole)'
    : 'un riassunto dettagliato e completo con tutte le sezioni, esempi e concetti (600-1000 parole)'

  const prompt = `Sei un professore universitario di ${subjectName}. Basandoti sul seguente materiale di studio, genera ${levelDesc}.

Materiale (${title}):
---
${content}
---

Formatta il riassunto in Markdown con:
${level === 'breve' ? '- Lista di bullet points\n- Concetti chiave in grassetto' : level === 'medio' ? '- Titoli ## e ###\n- Sezioni logiche\n- Punti importanti in grassetto' : '- Titoli ## e ###\n- Sezioni complete\n- Esempi pratici\n- Concetti chiave in grassetto\n- Tabelle dove utile'}

Rispondi solo con il riassunto in Markdown, nessun commento aggiuntivo.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un assistente specializzato in riassunti universitari. Rispondi con Markdown.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    }),
  })

  if (!response.ok) throw new Error(`OpenAI summary error: ${await response.text()}`)

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
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

    // Verifica limiti giornalieri
    const { data: canProceed } = await supabase.rpc('increment_ai_usage', {
      p_user_id: user.id,
      p_type: 'generate',
    })

    if (canProceed === false) {
      return new Response(
        JSON.stringify({ error: 'Limite giornaliero raggiunto. Puoi generare fino a 20 contenuti al giorno.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crea job nel DB
    const { data: job, error: jobError } = await supabase
      .from('ai_jobs')
      .insert({
        user_id: user.id,
        job_type: body.job_type,
        status: 'processing',
        progress: 10,
        started_at: new Date().toISOString(),
        input_params: body,
        source_material_id: body.material_id ?? null,
        source_note_id: body.note_id ?? null,
      })
      .select()
      .single()

    if (jobError || !job) throw new Error('Impossibile creare il job')

    // Aggiorna progresso
    const updateProgress = (p: number) =>
      supabase.from('ai_jobs').update({ progress: p }).eq('id', job.id)

    // Recupera contenuto sorgente
    const { content, title, subjectName } = await getSourceContent(
      supabase, user.id, body.material_id, body.note_id
    )

    if (!content || content.length < 100) {
      await supabase.from('ai_jobs').update({
        status: 'failed',
        error_message: 'Contenuto sorgente non trovato o troppo breve. Assicurati di aver effettuato il parsing del documento.',
        progress: 100,
        completed_at: new Date().toISOString(),
      }).eq('id', job.id)

      return new Response(
        JSON.stringify({ error: 'Contenuto sorgente non disponibile. Esegui prima il parsing del documento.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await updateProgress(30)

    let output: any = null
    let outputType  = body.job_type.replace('generate_', '') + 's'

    // Dispatch per tipo
    if (body.job_type === 'generate_quiz') {
      const questions = await generateQuiz(
        content, title, subjectName,
        body.num_questions ?? 10,
        body.difficulty ?? 'medio',
        body.question_types ?? ['multiple_choice', 'true_false'],
        body.topic ?? title
      )
      output = { questions, quiz_title: `Quiz AI - ${title}`, topic: body.topic ?? title }
      outputType = 'quiz_questions'
    } else if (body.job_type === 'generate_flashcards') {
      const flashcards = await generateFlashcards(content, title, subjectName, body.num_cards ?? 15)
      output = { flashcards, deck_title: `Flashcard AI - ${title}` }
      outputType = 'flashcards'
    } else if (body.job_type === 'generate_summary') {
      const summary = await generateSummary(content, title, subjectName, body.summary_level ?? 'medio')
      output = { summary, title: `Riassunto AI - ${title}`, level: body.summary_level ?? 'medio' }
      outputType = 'summary'
    }

    await updateProgress(85)

    // Salva output
    const { data: savedOutput } = await supabase
      .from('ai_outputs')
      .insert({
        job_id: job.id,
        user_id: user.id,
        output_type: outputType,
        content: output,
        content_text: JSON.stringify(output).slice(0, 500),
        metadata: { material_id: body.material_id, note_id: body.note_id, title },
      })
      .select()
      .single()

    // Completa job
    await supabase.from('ai_jobs').update({
      status: 'completed',
      progress: 100,
      completed_at: new Date().toISOString(),
    }).eq('id', job.id)

    return new Response(
      JSON.stringify({ success: true, job_id: job.id, output_id: savedOutput?.id, output }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('AI Job Processor Error:', error)
    return new Response(
      JSON.stringify({ error: 'Errore interno nel processare il job AI', detail: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
