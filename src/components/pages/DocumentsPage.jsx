import { useState } from 'react'
import PropTypes from 'prop-types'
import DocumentUpload from '../DocumentUpload.jsx'
import AnalysisChat from '../AnalysisChat.jsx'
import { Icon } from '../Icons.jsx'

const SAMPLE_DOCS = [
  { id: 1, name: 'Acme_Series_B_Term_Sheet.pdf', size: 340210, deal: 'Series B — Acme Corp', uploaded: '2h ago', analyzed: true, type: 'Term Sheet' },
  { id: 2, name: 'NovaTech_APA_Draft_v3.pdf', size: 820560, deal: 'Asset Purchase — NovaTech', uploaded: '4h ago', analyzed: true, type: 'Agreement' },
  { id: 3, name: 'Meridian_IP_License_Agreement.pdf', size: 512400, deal: 'IP License — Meridian Labs', uploaded: '1d ago', analyzed: false, type: 'License' },
  { id: 4, name: 'Helios_Prism_Merger_Agreement.pdf', size: 1240000, deal: 'Merger Review — Helios + Prism', uploaded: '30m ago', analyzed: true, type: 'Merger' },
  { id: 5, name: 'NDA_Template_2026.pdf', size: 98600, deal: 'General', uploaded: '3d ago', analyzed: false, type: 'NDA' },
]

const TYPE_COLORS = {
  'Term Sheet': { bg: 'rgba(99,102,241,0.1)', color: 'var(--color-accent)' },
  'Agreement': { bg: 'rgba(34,197,94,0.1)', color: 'var(--color-success)' },
  'License': { bg: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' },
  'Merger': { bg: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' },
  'NDA': { bg: 'rgba(6,182,212,0.1)', color: 'var(--color-cyan)' },
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState(SAMPLE_DOCS)
  const [activeDoc, setActiveDoc] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('uploaded')

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
      type: 'Document',
    }
    setDocs(prev => [newDoc, ...prev])
    setActiveDoc(newDoc)
  }

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.deal.toLowerCase().includes(search.toLowerCase()) ||
    (d.type || '').toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'size') return b.size - a.size
    return 0 // 'uploaded' keeps insertion order (newest first via prepend)
  })

  if (activeDoc && activeDoc.base64) {
    return (
      <AnalysisChat
        document={activeDoc}
        onBack={() => setActiveDoc(null)}
      />
    )
  }

  const analyzedCount = docs.filter(d => d.analyzed).length
  const totalSizeMb = (docs.reduce((s, d) => s + d.size, 0) / (1024 * 1024)).toFixed(1)

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">Upload, manage, and analyze legal documents</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Documents', value: docs.length, color: 'var(--color-accent)' },
          { label: 'Analyzed', value: analyzedCount, color: 'var(--color-success)' },
          { label: 'Storage Used', value: `${totalSizeMb} MB`, color: 'var(--color-cyan)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: '-0.03em', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Upload New Document</h2>
        </div>
        <DocumentUpload onDocumentLoaded={handleDocumentLoaded} />
      </div>

      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>All Documents</h2>
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                color: 'var(--color-text)',
                fontSize: 12,
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="uploaded">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest first</option>
            </select>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)', display: 'flex', pointerEvents: 'none',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                style={{
                  padding: '6px 10px 6px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontSize: 12,
                  outline: 'none',
                  width: 180,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.length === 0 && (
            <div className="card empty-state">
              <div className="empty-icon"><Icon name="documents" /></div>
              <div className="empty-title">No documents found</div>
              <div className="empty-desc">No documents match your search. Try different keywords or upload a new document.</div>
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
  const sizeKb = doc.size > 1024 * 1024
    ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB`
    : `${(doc.size / 1024).toFixed(0)} KB`
  const typeStyle = TYPE_COLORS[doc.type] || { bg: 'var(--color-accent-soft)', color: 'var(--color-accent)' }

  return (
    <div className="card" style={{ padding: '13px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: typeStyle.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: typeStyle.color, flexShrink: 0,
        }}>
          <Icon name="documents" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <p style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.name}
            </p>
            {doc.type && (
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 20, flexShrink: 0,
                background: typeStyle.bg, color: typeStyle.color,
              }}>
                {doc.type}
              </span>
            )}
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
            {doc.deal} · {sizeKb} · {doc.uploaded}
          </p>
        </div>
        {doc.analyzed && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: 'var(--color-success-soft)', color: 'var(--color-success)',
            border: '1px solid rgba(34,197,94,0.2)', flexShrink: 0,
          }}>✓ Analyzed</span>
        )}
        {doc.base64 && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onAnalyze}
            style={{ flexShrink: 0 }}
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
    type: PropTypes.string,
  }).isRequired,
  onAnalyze: PropTypes.func.isRequired,
}
