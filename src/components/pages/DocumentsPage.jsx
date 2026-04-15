import { useState } from 'react'
import PropTypes from 'prop-types'
import DocumentUpload from '../DocumentUpload.jsx'
import AnalysisChat from '../AnalysisChat.jsx'
import { Icon } from '../Icons.jsx'

const SAMPLE_DOCS = [
  { id: 1, name: 'Acme_Series_B_Term_Sheet.pdf', size: 340210, deal: 'Series B — Acme Corp', uploaded: '2h ago', analyzed: true },
  { id: 2, name: 'NovaTech_APA_Draft_v3.pdf', size: 820560, deal: 'Asset Purchase — NovaTech', uploaded: '4h ago', analyzed: true },
  { id: 3, name: 'Meridian_IP_License_Agreement.pdf', size: 512400, deal: 'IP License — Meridian Labs', uploaded: '1d ago', analyzed: false },
  { id: 4, name: 'Helios_Prism_Merger_Agreement.pdf', size: 1240000, deal: 'Merger Review — Helios + Prism', uploaded: '30m ago', analyzed: true },
  { id: 5, name: 'NDA_Template_2026.pdf', size: 98600, deal: 'General', uploaded: '3d ago', analyzed: false },
]

export default function DocumentsPage() {
  const [docs, setDocs] = useState(SAMPLE_DOCS)
  const [activeDoc, setActiveDoc] = useState(null)
  const [search, setSearch] = useState('')

  const handleDocumentLoaded = (doc) => {
    const newDoc = {
      id: Date.now(),
      name: doc.name,
      size: doc.size,
      deal: 'General',
      uploaded: 'just now',
      analyzed: false,
      base64: doc.base64,
      mediaType: doc.mediaType,
    }
    setDocs(prev => [newDoc, ...prev])
    setActiveDoc(newDoc)
  }

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.deal.toLowerCase().includes(search.toLowerCase())
  )

  if (activeDoc && activeDoc.base64) {
    return (
      <AnalysisChat
        document={activeDoc}
        onBack={() => setActiveDoc(null)}
      />
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">Upload, manage, and analyze legal documents</p>
      </div>

      <div className="section">
        <h2 className="section-title">Upload New Document</h2>
        <DocumentUpload onDocumentLoaded={handleDocumentLoaded} />
      </div>

      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>All Documents</h2>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            style={{
              marginLeft: 'auto',
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: 13,
              outline: 'none',
              width: 220,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No documents match your search.</p>
            </div>
          )}
          {filtered.map((doc) => (
            <DocRow key={doc.id} doc={doc} onAnalyze={() => setActiveDoc(doc)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DocRow({ doc, onAnalyze }) {
  const sizeKb = (doc.size / 1024).toFixed(0)
  return (
    <div className="card" style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}><Icon name="documents" /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {doc.deal} · {sizeKb} KB · {doc.uploaded}
          </p>
        </div>
        {doc.analyzed && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
            background: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', flexShrink: 0
          }}>Analyzed</span>
        )}
        {doc.base64 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAnalyze}
            style={{ flexShrink: 0, fontSize: 12, padding: '6px 12px' }}
          >
            Analyze
          </button>
        )}
      </div>
    </div>
  )
}

DocRow.propTypes = {
  doc: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    deal: PropTypes.string.isRequired,
    uploaded: PropTypes.string.isRequired,
    analyzed: PropTypes.bool.isRequired,
    base64: PropTypes.string,
  }).isRequired,
  onAnalyze: PropTypes.func.isRequired,
}
