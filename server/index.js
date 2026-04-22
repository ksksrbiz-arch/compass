import Anthropic from '@anthropic-ai/sdk'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const app = express()
const port = process.env.PORT || 3001

// --- CORS: restrict to known origins ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin (curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}))

// --- Rate limiting: 60 req/min per IP ---
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Try again in a minute.' },
}))

app.use(express.json({ limit: '25mb' }))

// --- Auth stub: static bearer token ---
const AUTH_TOKEN = process.env.COMPASS_AUTH_TOKEN
const DEFAULT_PROVIDER = 'anthropic'
const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-4-6',
  gemini: 'models/gemini-2-5-flash',
}
const ALLOWED_MODELS = {
  anthropic: new Set(['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001']),
  gemini: new Set(['models/gemini-2-5-pro', 'models/gemini-2-5-flash']),
}

function authMiddleware(req, res, next) {
  if (!AUTH_TOKEN) return next() // no token configured = open (dev mode)

  const header = req.headers.authorization
  if (!header || header !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

function getProviderConfig(body = {}) {
  const provider = body.provider === 'gemini' ? 'gemini' : DEFAULT_PROVIDER
  const apiKey = String(body.apiKey || '').trim() || (
    provider === 'gemini'
      ? process.env.GEMINI_API_KEY
      : process.env.ANTHROPIC_API_KEY
  )
  const requestedModel = String(body.model || '').trim()
  const model = ALLOWED_MODELS[provider].has(requestedModel)
    ? requestedModel
    : DEFAULT_MODELS[provider]

  return {
    provider,
    apiKey,
    model,
    requestedModel,
    maxTokens: Number(body.maxTokens) || 4096,
    analysisLanguage: body.analysisLanguage || 'English',
  }
}

function normalizeHistory(history = []) {
  return history
    .filter(msg => msg && (msg.role === 'user' || msg.role === 'assistant') && msg.content)
    .map(msg => ({
      role: msg.role,
      content: String(msg.content),
    }))
}

function buildPromptText(message, analysisLanguage) {
  return `${message}\n\nRespond in ${analysisLanguage}.`
}

async function analyzeWithAnthropic({ apiKey, model, maxTokens, history, document, message, analysisLanguage }) {
  const client = apiKey ? new Anthropic({ apiKey }) : anthropic

  if (!client) {
    throw new Error('An Anthropic API key is required.')
  }
  const conversationMessages = history.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))

  conversationMessages.push({
    role: 'user',
    content: [
      document,
      { type: 'text', text: buildPromptText(message, analysisLanguage) },
    ],
  })

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: conversationMessages,
  })

  return response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n\n')
}

async function analyzeWithGemini({ apiKey, model, maxTokens, history, document, message, analysisLanguage }) {
  if (!apiKey) {
    throw new Error('A Gemini API key is required.')
  }

  const documentPart = document?.source?.data
    ? {
        inline_data: {
          mime_type: document.source.media_type,
          data: document.source.data,
        },
      }
    : null

  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  contents.push({
    role: 'user',
    parts: [
      ...(documentPart ? [documentPart] : []),
      { text: buildPromptText(message, analysisLanguage) },
    ],
  })

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini API request failed.')
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map(part => part.text)
    .filter(Boolean)
    .join('\n\n')

  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

  return text
}

const SYSTEM_PROMPT = `You are Compass, an AI legal intelligence assistant specialized in contract and deal analysis.

Your capabilities:
- Extract and analyze contract structure, clauses, and terms
- Identify risks, unusual provisions, and non-standard language
- Compare clause language against market-standard benchmarks
- Summarize key obligations, rights, and deadlines for each party
- Flag potential issues: liability exposure, indemnification gaps, termination triggers, IP assignment scope, change-of-control provisions

Guidelines:
- Be precise and cite specific sections/clauses when referencing the document
- Use clear, structured formatting with headers and bullet points
- Distinguish between observations (what the document says) and assessments (what warrants attention)
- When uncertain, say so — do not fabricate clause references
- Prioritize actionable insights over exhaustive summaries`

app.post('/api/analyze', authMiddleware, async (req, res) => {
  try {
    const { document, message, history = [] } = req.body

    if (!document || !message) {
      return res.status(400).json({ error: 'Document and message are required.' })
    }

    const providerConfig = getProviderConfig(req.body)

    if (!providerConfig.apiKey) {
      return res.status(400).json({
        error: providerConfig.provider === 'gemini'
          ? 'A Gemini API key is required.'
          : 'An Anthropic API key is required.',
      })
    }

    if (providerConfig.requestedModel && providerConfig.requestedModel !== providerConfig.model) {
      return res.status(400).json({ error: 'Unsupported model selected.' })
    }

    const normalizedHistory = normalizeHistory(history)
    const content = providerConfig.provider === 'gemini'
      ? await analyzeWithGemini({
          ...providerConfig,
          history: normalizedHistory,
          document,
          message,
        })
      : await analyzeWithAnthropic({
          ...providerConfig,
          history: normalizedHistory,
          document,
          message,
        })

    res.json({ content })
  } catch (err) {
    console.error('AI provider error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: {
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
    },
  })
})

app.listen(port, () => {
  console.log(`Compass API proxy running on http://localhost:${port}`)
})
