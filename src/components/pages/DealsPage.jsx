import { useState } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../Icons.jsx'

const STATUS_LABELS = {
  active: 'Active',
  review: 'In Review',
  pending: 'Pending',
  closed: 'Closed',
}

const INITIAL_DEALS = [
  {
    id: 1,
    title: 'Series B — Acme Corp',
    status: 'active',
    description: 'Due diligence review for $45M Series B financing round. 12 documents pending review.',
    docs: 24,
    parties: 4,
    updated: '2h ago',
    value: '$45M',
    type: 'Venture Financing',
    lead: 'Sarah Chen',
    parties_list: ['Acme Corp', 'Lead Ventures', 'Orion Capital', 'Founder Group'],
    notes: 'Closing expected Q2. Key open items: rep & warranty insurance, cap table clean-up, ROFR waivers from existing investors.',
    progress: 72,
    health: 92,
    riskLevel: 'low',
    openItems: 3,
  },
  {
    id: 2,
    title: 'Asset Purchase — NovaTech',
    status: 'review',
    description: 'Asset purchase agreement analysis. Key terms extracted, awaiting partner sign-off.',
    docs: 18,
    parties: 3,
    updated: '4h ago',
    value: '$12M',
    type: 'Asset Purchase',
    lead: 'Marcus Liu',
    parties_list: ['NovaTech Inc.', 'Buyer LLC', 'Escrow Bank'],
    notes: 'Purchase price allocation TBD. Environmental reps flagged for further review. HSR filing likely required.',
    progress: 55,
    health: 74,
    riskLevel: 'medium',
    openItems: 7,
  },
  {
    id: 3,
    title: 'IP License — Meridian Labs',
    status: 'pending',
    description: 'Cross-license negotiation for patent portfolio. Clause comparison in progress.',
    docs: 9,
    parties: 2,
    updated: '1d ago',
    value: 'Undisclosed',
    type: 'IP License',
    lead: 'Priya Nair',
    parties_list: ['Meridian Labs', 'TechCo Partners'],
    notes: 'Field-of-use restrictions are the main sticking point. Royalty rate to be benchmarked against comparables.',
    progress: 30,
    health: 61,
    riskLevel: 'medium',
    openItems: 5,
  },
  {
    id: 4,
    title: 'Merger Review — Helios + Prism',
    status: 'active',
    description: 'Regulatory filing preparation and antitrust risk assessment for horizontal merger.',
    docs: 42,
    parties: 6,
    updated: '30m ago',
    value: '$220M',
    type: 'Merger',
    lead: 'James Okafor',
    parties_list: ['Helios Corp', 'Prism Industries', 'DOJ', 'FTC', 'Advisory Bank', 'Outside Counsel'],
    notes: 'Second request received. Hart-Scott-Rodino waiting period extended. Preparing substantive response.',
    progress: 88,
    health: 58,
    riskLevel: 'high',
    openItems: 11,
  },
]

const RISK_COLORS = {
  low: { color: 'var(--color-success)', bg: 'var(--color-success-soft)', label: 'Low Risk' },
  medium: { color: 'var(--color-warning)', bg: 'var(--color-warning-soft)', label: 'Med Risk' },
  high: { color: 'var(--color-danger)', bg: 'var(--color-danger-soft)', label: 'High Risk' },
}

const DEAL_TYPES = [
  'Venture Financing',
  'Asset Purchase',
  'IP License',
  'Merger',
  'Acquisition',
  'Joint Venture',
  'Real Estate',
  'Other',
]

function NewDealModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    type: 'Venture Financing',
    value: '',
    lead: '',
    description: '',
    status: 'pending',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Deal name is required.'); return }
    if (!form.lead.trim()) { setError('Lead attorney is required.'); return }
    const newDeal = {
      id: Date.now(),
      title: form.title.trim(),
      type: form.type,
      value: form.value.trim() || 'Undisclosed',
      lead: form.lead.trim(),
      description: form.description.trim() || 'New deal — no description yet.',
      status: form.status,
      docs: 0,
      parties: 1,
      updated: 'just now',
      parties_list: [],
      notes: '',
      progress: 0,
      health: 80,
      riskLevel: 'low',
      openItems: 0,
    }
    onSave(newDeal)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Create new deal">
        <h2 className="modal-title">New Deal</h2>
        <p className="modal-subtitle">Create a new deal to track in your workspace.</p>
        {error && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--color-danger-soft)', color: 'var(--color-danger)', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label" htmlFor="new-deal-title">Deal Name *</label>
            <input
              id="new-deal-title"
              type="text"
              className="settings-input"
              placeholder="e.g. Series A — Acme Corp"
              value={form.title}
              onChange={set('title')}
              autoFocus
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="modal-field">
              <label className="modal-label" htmlFor="new-deal-type">Deal Type</label>
              <select id="new-deal-type" className="settings-input" value={form.type} onChange={set('type')}>
                {DEAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="new-deal-status">Status</label>
              <select id="new-deal-status" className="settings-input" value={form.status} onChange={set('status')}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="modal-field">
              <label className="modal-label" htmlFor="new-deal-value">Deal Value</label>
              <input
                id="new-deal-value"
                type="text"
                className="settings-input"
                placeholder="e.g. $10M"
                value={form.value}
                onChange={set('value')}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="new-deal-lead">Lead Attorney *</label>
              <input
                id="new-deal-lead"
                type="text"
                className="settings-input"
                placeholder="e.g. Sarah Chen"
                value={form.lead}
                onChange={set('lead')}
              />
            </div>
          </div>
          <div className="modal-field">
            <label className="modal-label" htmlFor="new-deal-desc">Description</label>
            <textarea
              id="new-deal-desc"
              className="settings-input"
              placeholder="Brief deal description…"
              value={form.description}
              onChange={set('description')}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Create Deal</button>
          </div>
        </form>
      </div>
    </div>
  )
}

NewDealModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

function HealthBar({ value }) {
  const color = value >= 80 ? 'var(--color-success)' : value >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

HealthBar.propTypes = { value: PropTypes.number.isRequired }

function DealDetail({ deal, onBack }) {
  const risk = RISK_COLORS[deal.riskLevel]
  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} aria-label="Back to deals" style={{ marginTop: 4 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">{deal.title}</h1>
          <p className="page-subtitle">{deal.type} · {deal.value} · Updated {deal.updated}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className={`card-status ${deal.status}`}>{STATUS_LABELS[deal.status]}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: risk.bg, color: risk.color, border: `1px solid ${risk.color}33` }}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Documents', value: deal.docs, color: 'var(--color-accent)' },
          { label: 'Parties', value: deal.parties, color: 'var(--color-cyan)' },
          { label: 'Open Items', value: deal.openItems, color: deal.openItems > 8 ? 'var(--color-danger)' : 'var(--color-warning)' },
          { label: 'Health Score', value: deal.health, color: deal.health >= 80 ? 'var(--color-success)' : deal.health >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, letterSpacing: '-0.04em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 14 }}>Deal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <InfoRow label="Type" value={deal.type} />
            <InfoRow label="Value" value={deal.value} />
            <InfoRow label="Lead" value={deal.lead} />
            <InfoRow label="Documents" value={`${deal.docs} files`} />
            <InfoRow label="Last Updated" value={deal.updated} />
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>Deal Progress</div>
            <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${deal.progress}%`, height: '100%', borderRadius: 3,
                background: deal.status === 'active'
                  ? 'linear-gradient(90deg, var(--color-success), #16a34a)'
                  : deal.status === 'review'
                    ? 'linear-gradient(90deg, var(--color-accent), var(--color-purple))'
                    : 'var(--color-warning)',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
              <span>Progress</span>
              <span>{deal.progress}%</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 14 }}>Parties ({deal.parties})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deal.parties_list.map((p, idx) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: idx === 0 ? 'linear-gradient(135deg, var(--color-accent), var(--color-purple))' : 'rgba(99,102,241,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: idx === 0 ? 'white' : 'var(--color-accent)',
                  flexShrink: 0,
                }}>
                  {p.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>Health Score</h3>
        <HealthBar value={deal.health} />
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
          Based on document completeness, outstanding items, and risk flags.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>Notes & Status</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{deal.notes}</p>
      </div>

      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 12 }}>Documents ({deal.docs})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: Math.min(deal.docs, 6) }, (_, i) => {
            const docNames = ['Term Sheet', 'NDA', 'Due Diligence Checklist', 'Cap Table', 'Shareholders Agreement', 'Board Consent']
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                background: 'var(--color-surface-hover)',
                borderRadius: 8, cursor: 'pointer',
                transition: 'background var(--transition)',
              }}>
                <span style={{ color: 'var(--color-accent)' }}><Icon name="documents" /></span>
                <span style={{ fontSize: 13.5, flex: 1 }}>
                  {docNames[i] || `Document ${i + 1}`}.pdf
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-border)', padding: '2px 8px', borderRadius: 4 }}>PDF</span>
              </div>
            )
          })}
          {deal.docs > 6 && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', paddingTop: 6 }}>
              +{deal.docs - 6} more documents
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

DealDetail.propTypes = {
  deal: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, alignItems: 'center' }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default function DealsPage() {
  const [deals, setDeals] = useState(INITIAL_DEALS)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showNewDeal, setShowNewDeal] = useState(false)

  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter)

  if (selectedDeal) {
    return <DealDetail deal={selectedDeal} onBack={() => setSelectedDeal(null)} />
  }

  const stats = {
    total: deals.length,
    active: deals.filter(d => d.status === 'active').length,
    totalValue: `$${deals.reduce((s, d) => s + (parseFloat((d.value || '0').replace(/[^0-9.]/g, '')) || 0), 0).toFixed(0)}M+`,
    avgHealth: deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.health, 0) / deals.length) : 0,
  }

  return (
    <div className="fade-in">
      {showNewDeal && (
        <NewDealModal
          onClose={() => setShowNewDeal(false)}
          onSave={(deal) => setDeals(prev => [deal, ...prev])}
        />
      )}

      <div className="page-header">
        <h1 className="page-title">Deal Analysis</h1>
        <p className="page-subtitle">Track and analyze all active deals and transactions</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Deals', value: stats.total, color: 'var(--color-accent)' },
          { label: 'Active', value: stats.active, color: 'var(--color-success)' },
          { label: 'Portfolio Value', value: stats.totalValue, color: 'var(--color-cyan)' },
          { label: 'Avg Health', value: `${stats.avgHealth}`, color: stats.avgHealth >= 70 ? 'var(--color-success)' : 'var(--color-warning)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: '-0.03em', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'active', 'review', 'pending', 'closed'].map(f => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Deals' : STATUS_LABELS[f]}
            {f !== 'closed' && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>
                {f === 'all' ? deals.length : deals.filter(d => d.status === f).length}
              </span>
            )}
          </button>
        ))}
        <button type="button" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowNewDeal(true)}>
          + New Deal
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div className="card empty-state">
            <div className="empty-icon"><Icon name="deals" /></div>
            <div className="empty-title">No deals found</div>
            <div className="empty-desc">No deals match this filter. Try a different status or create a new deal.</div>
          </div>
        )}
        {filtered.map((deal) => {
          const risk = RISK_COLORS[deal.riskLevel]
          return (
            <div
              key={deal.id}
              className="card"
              style={{ cursor: 'pointer', padding: '18px 20px' }}
              onClick={() => setSelectedDeal(deal)}
              role="button"
              tabIndex={0}
              aria-label={`Open deal: ${deal.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDeal(deal) }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div className="card-header" style={{ marginBottom: 6 }}>
                    <div>
                      <h3 className="card-title" style={{ marginBottom: 2 }}>{deal.title}</h3>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{deal.type} · {deal.value}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {risk && <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: risk.bg, color: risk.color }}>{risk.label}</span>}
                      <span className={`card-status ${deal.status}`}>{STATUS_LABELS[deal.status]}</span>
                    </div>
                  </div>
                  <p className="card-description" style={{ marginBottom: 12 }}>{deal.description}</p>
                  <div className="card-meta" style={{ marginBottom: 10 }}>
                    <span className="card-meta-item">{deal.docs} docs</span>
                    <span className="card-meta-item">{deal.parties} parties</span>
                    <span className="card-meta-item">Lead: {deal.lead}</span>
                    <span className="card-meta-item" style={{ marginLeft: 'auto', color: 'var(--color-text-faint)' }}>Updated {deal.updated}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        <span>Progress</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: `${deal.progress}%`, height: '100%', borderRadius: 2,
                          background: deal.status === 'active'
                            ? 'linear-gradient(90deg, var(--color-success), #16a34a)'
                            : deal.status === 'review'
                              ? 'linear-gradient(90deg, var(--color-accent), var(--color-purple))'
                              : 'var(--color-warning)',
                        }} />
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Health</div>
                      <HealthBar value={deal.health} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
