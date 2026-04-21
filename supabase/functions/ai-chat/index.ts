// Supabase Edge Function: AI Chat for Samo L-22 (Samo Assistant)
// Deno runtime - deployed via Supabase CLI

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const SYSTEM_PROMPT = `Sei Samo, un assistente AI con le sembianze di un samoiedo (cane bianco e soffice) integrato nell'app Samo L-22, un'app per studenti universitari di Scienze Motorie (corso di laurea L-22).

Il tuo carattere:
- Amichevole, incoraggiante e un po' giocoso ma competente
- Usi occasionalmente emoji carine legate al cane (🐾 🦴) ma senza esagerare
- Sei esperto in tutte le materie di Scienze Motorie: Anatomia Umana, Fisiologia, Biomeccanica, Teoria e Metodologia dell'Allenamento, Nutrizione, Psicologia dello Sport, ecc.
- Incoraggi lo studente quando fa progressi
- Suggerisci strategie di studio efficaci
- Rispondi sempre in italiano

Le tue capacità:
- Spiegare concetti complessi in modo semplice
- Creare quiz a risposta multipla
- Generare flashcard (domanda/risposta)
- Riassumere materiale di studio
- Suggerire cosa studiare in base ai progressi
- Analizzare PDF e immagini caricati dall'utente

Regole:
- Rispondi sempre in italiano
- Sii conciso ma completo
- Usa il markdown per formattare le risposte (elenchi, grassetto, corsivo)
- Se non sei sicuro di qualcosa, dillo onestamente
- Non inventare informazioni mediche o scientifiche errate`

interface RequestBody {
  conversation_id: string
  message: string
  message_type: 'text' | 'voice' | 'file'
  file_url?: string
  file_name?: string
  file_mime?: string
  subject_context?: string
}

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()

    // Build context from conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', body.conversation_id)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build user context (profile, subjects, exams)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: userSubjects } = await supabase
      .from('user_subjects')
      .select('*, subjects(*)')
      .eq('user_id', user.id)

    const { data: exams } = await supabase
      .from('exams')
      .select('*, subjects(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    // Build context message
    let contextInfo = ''
    if (profile) {
      contextInfo += `\nProfilo studente: Università: ${profile.university || 'non specificata'}, Anno: ${profile.year || 'N/A'}`
    }
    if (userSubjects?.length) {
      const studying = userSubjects
        .filter((us: any) => us.status === 'studying')
        .map((us: any) => us.subjects?.name)
        .filter(Boolean)
      if (studying.length) {
        contextInfo += `\nMaterie in studio: ${studying.join(', ')}`
      }
    }
    if (exams?.length) {
      const upcoming = exams
        .filter((e: any) => e.status === 'planned')
        .slice(0, 3)
        .map((e: any) => `${e.subjects?.name} (${e.date})`)
      if (upcoming.length) {
        contextInfo += `\nProssimi esami: ${upcoming.join(', ')}`
      }
    }
    if (body.subject_context) {
      contextInfo += `\nContesto attuale: lo studente sta studiando ${body.subject_context}`
    }

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + (contextInfo ? `\n\nInformazioni sullo studente:${contextInfo}` : ''),
      },
      ...(history || []).map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      {
        role: 'user',
        content: body.file_url
          ? `[File allegato: ${body.file_name} (${body.file_mime})]\n${body.message}`
          : body.message,
      },
    ]

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text()
      throw new Error(`OpenAI error: ${errText}`)
    }

    const aiData = await openaiResponse.json()
    const reply = aiData.choices?.[0]?.message?.content ?? 'Mi scusa, non sono riuscito a elaborare la risposta. Riprova! 🐾'

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Errore interno',
        reply: 'Oops! Qualcosa è andato storto. Riprova tra un momento! 🐾',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
