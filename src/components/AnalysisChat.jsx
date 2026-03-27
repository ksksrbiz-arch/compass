import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function AnalysisChat({ document, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [structureExtracted, setStructureExtracted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (document && !structureExtracted) {
      extractStructure()
    }
  }, [document])

  const extractStructure = async () => {
    setIsLoading(true)
    setMessages([{
      role: 'assistant',
      content: `Analyzing **${document.name}**... Extracting document structure and key clauses.`,
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
          message: 'Extract the structure of this document. Identify: 1) Document type and parties involved, 2) Key sections and their page numbers, 3) Critical clauses (indemnification, termination, non-compete, IP assignment, liability caps, change of control), 4) Any unusual or non-standard terms that warrant closer review. Present this as a structured overview.',
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setMessages([{
        role: 'assistant',
        content: data.content,
      }])
      setStructureExtracted(true)
    } catch (err) {
      setMessages([{
        role: 'assistant',
        content: `Failed to analyze document: ${err.message}. Make sure the backend proxy is running.`,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
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
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.message}`,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <div className="analysis-doc-info">
          <span className="analysis-doc-name">{document.name}</span>
          <span className="analysis-doc-size">
            {(document.size / 1024).toFixed(0)} KB
          </span>
        </div>
      </div>

      <div className="analysis-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            <div className="message-label">
              {msg.role === 'assistant' ? 'Compass AI' : 'You'}
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-assistant">
            <div className="message-label">Compass AI</div>
            <div className="message-content">
              <span className="typing-indicator" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="analysis-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={structureExtracted ? 'Ask about this document...' : 'Extracting structure...'}
          aria-label="Ask a question about the document"
          disabled={isLoading || !structureExtracted}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !input.trim()}
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
