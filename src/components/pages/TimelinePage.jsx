import { useState } from 'react'
import PropTypes from 'prop-types'

const TODAY = new Date('2026-04-15')

const TIMELINE_EVENTS = [
  {
    id: 1,
    date: 'Apr 18, 2026',
    dateObj: new Date('2026-04-18'),
    title: 'LOI Expiration — Helios + Prism',
    type: 'deadline',
    deal: 'Merger Review — Helios + Prism',
    description: 'Letter of Intent expires. Definitive merger agreement must be executed or renegotiated.',
    priority: 'high',
  },
  {
    id: 2,
    date: 'Apr 22, 2026',
    dateObj: new Date('2026-04-22'),
    title: 'Closing — Series B Acme Corp',
    type: 'closing',
    deal: 'Series B — Acme Corp',
    description: 'Target closing date for $45M Series B financing round. Board consents due 24h prior.',
    priority: 'high',
  },
  {
    id: 3,
    date: 'Apr 25, 2026',
    dateObj: new Date('2026-04-25'),
    title: 'Partner Review — NovaTech APA',
    type: 'review',
    deal: 'Asset Purchase — NovaTech',
    description: 'Internal partner review of revised Asset Purchase Agreement. Red-line due by EOD.',
    priority: 'medium',
  },
  {
    id: 4,
    date: 'May 2, 2026',
    dateObj: new Date('2026-05-02'),
    title: 'Regulatory Filing — DOJ',
    type: 'filing',
    deal: 'Merger Review — Helios + Prism',
    description: 'Department of Justice second request response filing deadline.',
    priority: 'high',
  },
  {
    id: 5,
    date: 'May 10, 2026',
    dateObj: new Date('2026-05-10'),
    title: 'Royalty Rate Negotiation — Meridian',
    type: 'negotiation',
    deal: 'IP License — Meridian Labs',
    description: 'In-person session for patent portfolio royalty rate benchmarking and term finalization.',
    priority: 'medium',
  },
  {
    id: 6,
    date: 'May 20, 2026',
    dateObj: new Date('2026-05-20'),
    title: 'Escrow Release — NovaTech',
    type: 'financial',
    deal: 'Asset Purchase — NovaTech',
    description: 'Initial escrow release upon satisfaction of post-closing conditions.',
    priority: 'low',
  },
]

const TYPE_CONFIG = {
  deadline: { bg: 'rgba(239,68,68,0.12)', color: 'var(--color-danger)', label: 'Deadline', icon: '⚑' },
  closing: { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', label: 'Closing', icon: '✓' },
  review: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', label: 'Review', icon: '◎' },
  filing: { bg: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)', label: 'Filing', icon: '⊞' },
  negotiation: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', label: 'Negotiation', icon: '↔' },
  financial: { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', label: 'Financial', icon: '$' },
}

const PRIORITY_COLORS = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
}

function getDaysUntil(dateObj) {
  const diff = Math.ceil((dateObj - TODAY) / (1000 * 60 * 60 * 24))
  if (diff === 0) return { label: 'Today', urgent: true }
  if (diff === 1) return { label: 'Tomorrow', urgent: true }
  if (diff < 0) return { label: `${Math.abs(diff)}d ago`, past: true }
  if (diff <= 7) return { label: `${diff} days`, urgent: true }
  return { label: `${diff} days` }
}

function AddEventModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    date: '',
    type: 'deadline',
    deal: '',
    priority: 'medium',
    description: '',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.date) { setError('Date is required.'); return }
    const dateObj = new Date(form.date)
    const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    onSave({
      id: Date.now(),
      title: form.title.trim(),
      date: formatted,
      dateObj,
      type: form.type,
      deal: form.deal.trim() || 'General',
      priority: form.priority,
      description: form.description.trim() || '',
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Add timeline event">
        <h2 className="modal-title">Add Timeline Event</h2>
        <p className="modal-subtitle">Add a new deadline, milestone, or key date.</p>
        {error && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--color-danger-soft)', color: 'var(--color-danger)', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label" htmlFor="evt-title">Title *</label>
            <input id="evt-title" type="text" className="settings-input" placeholder="e.g. Closing — Acme Corp" value={form.title} onChange={set('title')} autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="modal-field">
              <label className="modal-label" htmlFor="evt-date">Date *</label>
              <input id="evt-date" type="date" className="settings-input" value={form.date} onChange={set('date')} min="2026-01-01" />
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="evt-priority">Priority</label>
              <select id="evt-priority" className="settings-input" value={form.priority} onChange={set('priority')}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="modal-field">
              <label className="modal-label" htmlFor="evt-type">Event Type</label>
              <select id="evt-type" className="settings-input" value={form.type} onChange={set('type')}>
                {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="evt-deal">Related Deal</label>
              <input id="evt-deal" type="text" className="settings-input" placeholder="Deal name" value={form.deal} onChange={set('deal')} />
            </div>
          </div>
          <div className="modal-field">
            <label className="modal-label" htmlFor="evt-desc">Description</label>
            <textarea id="evt-desc" className="settings-input" placeholder="Optional notes…" value={form.description} onChange={set('description')} rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Add Event</button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddEventModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default function TimelinePage() {
  const [events, setEvents] = useState(TIMELINE_EVENTS)
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddEvent, setShowAddEvent] = useState(false)

  const filtered = events.filter(e => {
    if (priorityFilter !== 'all' && e.priority !== priorityFilter) return false
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    return true
  }).sort((a, b) => a.dateObj - b.dateObj)

  const urgentCount = events.filter(e => {
    const { urgent } = getDaysUntil(e.dateObj)
    return urgent
  }).length

  return (
    <div className="fade-in">
      {showAddEvent && (
        <AddEventModal
          onClose={() => setShowAddEvent(false)}
          onSave={(evt) => setEvents(prev => [...prev, evt])}
        />
      )}

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Timeline</h1>
          <p className="page-subtitle">Upcoming deadlines, milestones, and key dates across all deals</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 6 }} onClick={() => setShowAddEvent(true)}>
          + Add Event
        </button>
      </div>

      {urgentCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          background: 'var(--color-danger-soft)',
          border: '1px solid rgba(239,68,68,0.25)',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-danger)' }}>
              {urgentCount} upcoming event{urgentCount > 1 ? 's' : ''} within 7 days
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>
              Review deadlines and prepare deliverables
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'high', 'medium', 'low'].map(p => (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${priorityFilter === p ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setPriorityFilter(p)}
              style={{ textTransform: 'capitalize' }}
            >
              {p === 'all' ? 'All Priority' : `${p.charAt(0).toUpperCase() + p.slice(1)} Priority`}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '5px 10px',
            color: 'var(--color-text)',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Types</option>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon" style={{ fontSize: 24 }}>📅</div>
          <div className="empty-title">No events match</div>
          <div className="empty-desc">Try adjusting your filters to see timeline events.</div>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 13, top: 12, bottom: 12,
            width: 2,
            background: 'linear-gradient(to bottom, var(--color-accent), var(--color-border))',
            borderRadius: 2,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filtered.map((event) => {
              const typeStyle = TYPE_CONFIG[event.type] || TYPE_CONFIG.review
              const countdown = getDaysUntil(event.dateObj)
              return (
                <div key={event.id} style={{ position: 'relative' }} className="fade-in">
                  {/* Dot on line */}
                  <div style={{
                    position: 'absolute', left: -29, top: 16,
                    width: 14, height: 14, borderRadius: '50%',
                    background: PRIORITY_COLORS[event.priority],
                    border: '2px solid var(--color-bg)',
                    boxShadow: `0 0 0 3px ${PRIORITY_COLORS[event.priority]}33`,
                    zIndex: 1,
                  }} />

                  <div className="card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                            background: typeStyle.bg, color: typeStyle.color,
                            border: `1px solid ${typeStyle.color}33`,
                          }}>
                            {typeStyle.icon} {typeStyle.label}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{event.date}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                            background: countdown.urgent ? 'var(--color-danger-soft)' : countdown.past ? 'var(--color-border)' : 'var(--color-accent-soft)',
                            color: countdown.urgent ? 'var(--color-danger)' : countdown.past ? 'var(--color-text-muted)' : 'var(--color-accent)',
                          }}>
                            {countdown.label}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{event.title}</h3>
                      </div>
                      <span style={{
                        fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0,
                        background: 'var(--color-surface-hover)', padding: '3px 8px', borderRadius: 6,
                        maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {event.deal}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
