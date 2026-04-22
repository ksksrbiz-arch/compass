import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { escapeHtml, sanitizeMarkdown } from '../utils/sanitize.js'
import { getActiveAiModel, loadAppSettings } from '../utils/appSettings.js'
import { DocumentIcon } from './Icons.jsx'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const SUGGESTED_QUESTIONS = [
  'What are the key risks in this document?',
  'Summarize the indemnification clauses',
  'Who are the parties and what are their obligations?',
  'Are there any non-standard or unusual terms?',
  'What are the termination conditions?',
]

export default function AnalysisChat({ document, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [structureExtracted, setStructureExtracted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const extractStructure = useCallback(async () => {
    const settings = loadAppSettings()
    const provider = settings.aiProvider
    setIsLoading(true)
    setMessages([{
      role: 'assistant',
      content: `Analyzing **${escapeHtml(document.name)}**... Extracting document structure and key clauses.`,
    }])

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: {
            type: 'document',
            source: {
              type: 'base64',
              media_type: document.mediaType,
              data: document.base64,
            },
          },
          provider,
          model: getActiveAiModel(settings),
          apiKey: provider === 'gemini' ? settings.geminiApiKey : settings.anthropicApiKey,
          maxTokens: settings.maxTokens,
          analysisLanguage: settings.analysisLanguage,
          message: 'Extract the structure of this document. Identify: 1) Document type and parties involved, 2) Key sections and their page numbers, 3) Critical clauses (indemnification, termination, non-compete, IP assignment, liability caps, change of control), 4) Any unusual or non-standard terms that warrant closer review. Present this as a structured overview.',
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setMessages([{
        role: 'assistant',
        content: sanitizeMarkdown(data.content),
      }])
      setStructureExtracted(true)
    } catch (err) {
      setMessages([{
        role: 'assistant',
        content: `Failed to analyze document: ${escapeHtml(err.message)}. Make sure the backend proxy is running.`,
      }])
    } finally {
      setIsLoading(false)
    }
  }, [document, structureExtracted])

  useEffect(() => {
    if (document && !structureExtracted) {
      extractStructure()
    }
  }, [document, structureExtracted, extractStructure])

  const sendMessage = async (e, overrideText) => {
    if (e) e.preventDefault()
    const userMessage = (overrideText || input).trim()
    if (!userMessage || isLoading) return

    const settings = loadAppSettings()
    const provider = settings.aiProvider
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: {
            type: 'document',
            source: {
              type: 'base64',
              media_type: document.mediaType,
              data: document.base64,
            },
          },
          provider,
          model: getActiveAiModel(settings),
          apiKey: provider === 'gemini' ? settings.geminiApiKey : settings.anthropicApiKey,
          maxTokens: settings.maxTokens,
          analysisLanguage: settings.analysisLanguage,
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: sanitizeMarkdown(data.content) }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${escapeHtml(err.message)}`,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (q) => {
    if (!isLoading && structureExtracted) {
      sendMessage(null, q)
    }
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack} aria-label="Back to dashboard">← Back</button>
        <div className="analysis-doc-info">
          <div className="analysis-doc-icon" aria-hidden="true">
            <DocumentIcon />
          </div>
          <span className="analysis-doc-name">{escapeHtml(document.name)}</span>
          <span className="analysis-doc-size">
            {(document.size / 1024).toFixed(0)} KB
          </span>
        </div>
        {structureExtracted && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'var(--color-success-soft)',
            color: 'var(--color-success)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}>
            ✓ Analyzed
          </span>
        )}
      </div>

      <div className="analysis-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role} fade-in`}>
            <div className="message-label">
              {msg.role === 'assistant' && <span className="message-label-dot" />}
              {msg.role === 'assistant' ? 'Compass AI' : 'You'}
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-assistant fade-in">
            <div className="message-label">
              <span className="message-label-dot" />
              Compass AI
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {structureExtracted && messages.length < 3 && (
        <div className="suggested-questions" role="list" aria-label="Suggested questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="suggested-question"
              onClick={() => handleSuggestedQuestion(q)}
              disabled={isLoading}
              role="listitem"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form className="analysis-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={structureExtracted ? 'Ask about this document…' : 'Extracting structure…'}
          aria-label="Ask a question about the document"
          disabled={isLoading || !structureExtracted}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  )
}

AnalysisChat.propTypes = {
  document: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    base64: PropTypes.string.isRequired,
    mediaType: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
}
