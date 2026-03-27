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

function authMiddleware(req, res, next) {
  if (!AUTH_TOKEN) return next() // no token configured = open (dev mode)

  const header = req.headers.authorization
  if (!header || header !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

const anthropic = new Anthropic()

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

    const conversationMessages = []

    for (const msg of history) {
      conversationMessages.push({
        role: msg.role,
        content: msg.content,
      })
    }

    conversationMessages.push({
      role: 'user',
      content: [
        document,
        { type: 'text', text: message },
      ],
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
    })

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n\n')

    res.json({ content })
  } catch (err) {
    console.error('Anthropic API error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Compass API proxy running on http://localhost:${port}`)
})
