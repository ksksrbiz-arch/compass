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
  },
]

function DealDetail({ deal, onBack }) {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn btn-ghost" onClick={onBack} aria-label="Back to deals">← Back</button>
        <div>
          <h1 className="page-title">{deal.title}</h1>
          <p className="page-subtitle">{deal.type} · {deal.value} · Updated {deal.updated}</p>
        </div>
        <span className={`card-status ${deal.status}`} style={{ marginLeft: 'auto' }}>
          {STATUS_LABELS[deal.status]}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 12 }}>Deal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow label="Type" value={deal.type} />
            <InfoRow label="Value" value={deal.value} />
            <InfoRow label="Lead" value={deal.lead} />
            <InfoRow label="Documents" value={`${deal.docs} files`} />
            <InfoRow label="Last Updated" value={deal.updated} />
          </div>
        </div>
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 12 }}>Parties ({deal.parties})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deal.parties_list.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0
                }}>
                  {p.charAt(0)}
                </div>
                <span style={{ fontSize: 14 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title" style={{ marginBottom: 12 }}>Notes & Status</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{deal.notes}</p>
      </div>

      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 12 }}>Documents ({deal.docs})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: Math.min(deal.docs, 6) }, (_, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: 'var(--color-surface-hover)',
              borderRadius: 8, cursor: 'pointer',
            }}>
              <span style={{ color: 'var(--color-accent)' }}><Icon name="documents" /></span>
              <span style={{ fontSize: 14, flex: 1 }}>
                {['Term Sheet', 'NDA', 'Due Diligence Checklist', 'Cap Table', 'Shareholders Agreement', 'Board Consent'][i] || `Document ${i + 1}`}.pdf
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>PDF</span>
            </div>
          ))}
          {deal.docs > 6 && (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', paddingTop: 4 }}>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
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
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? INITIAL_DEALS : INITIAL_DEALS.filter(d => d.status === filter)

  if (selectedDeal) {
    return <DealDetail deal={selectedDeal} onBack={() => setSelectedDeal(null)} />
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Deal Analysis</h1>
        <p className="page-subtitle">Track and analyze all active deals and transactions</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'active', 'review', 'pending', 'closed'].map(f => (
          <button
            key={f}
            type="button"
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
            style={{ textTransform: 'capitalize' }}
          >
            {f === 'all' ? 'All Deals' : STATUS_LABELS[f]}
          </button>
        ))}
        <button type="button" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          + New Deal
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No deals found for this filter.</p>
          </div>
        )}
        {filtered.map((deal) => (
          <div
            key={deal.id}
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedDeal(deal)}
            role="button"
            tabIndex={0}
            aria-label={`Open deal: ${deal.title}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDeal(deal) }}
          >
            <div className="card-header">
              <div>
                <h3 className="card-title">{deal.title}</h3>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{deal.type} · {deal.value}</span>
              </div>
              <span className={`card-status ${deal.status}`}>{STATUS_LABELS[deal.status]}</span>
            </div>
            <p className="card-description">{deal.description}</p>
            <div className="card-meta">
              <span className="card-meta-item">{deal.docs} docs</span>
              <span className="card-meta-item">{deal.parties} parties</span>
              <span className="card-meta-item">Lead: {deal.lead}</span>
              <span className="card-meta-item" style={{ marginLeft: 'auto' }}>Updated {deal.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
