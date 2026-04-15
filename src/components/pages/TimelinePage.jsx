const TIMELINE_EVENTS = [
  {
    id: 1,
    date: 'Apr 18, 2026',
    title: 'LOI Expiration — Helios + Prism',
    type: 'deadline',
    deal: 'Merger Review — Helios + Prism',
    description: 'Letter of Intent expires. Definitive merger agreement must be executed or renegotiated.',
    priority: 'high',
  },
  {
    id: 2,
    date: 'Apr 22, 2026',
    title: 'Closing — Series B Acme Corp',
    type: 'closing',
    deal: 'Series B — Acme Corp',
    description: 'Target closing date for $45M Series B financing round. Board consents due 24h prior.',
    priority: 'high',
  },
  {
    id: 3,
    date: 'Apr 25, 2026',
    title: 'Partner Review — NovaTech APA',
    type: 'review',
    deal: 'Asset Purchase — NovaTech',
    description: 'Internal partner review of revised Asset Purchase Agreement. Red-line due by EOD.',
    priority: 'medium',
  },
  {
    id: 4,
    date: 'May 2, 2026',
    title: 'Regulatory Filing — DOJ',
    type: 'filing',
    deal: 'Merger Review — Helios + Prism',
    description: 'Department of Justice second request response filing deadline.',
    priority: 'high',
  },
  {
    id: 5,
    date: 'May 10, 2026',
    title: 'Royalty Rate Negotiation — Meridian',
    type: 'negotiation',
    deal: 'IP License — Meridian Labs',
    description: 'In-person session for patent portfolio royalty rate benchmarking and term finalization.',
    priority: 'medium',
  },
  {
    id: 6,
    date: 'May 20, 2026',
    title: 'Escrow Release — NovaTech',
    type: 'financial',
    deal: 'Asset Purchase — NovaTech',
    description: 'Initial escrow release upon satisfaction of post-closing conditions.',
    priority: 'low',
  },
]

const TYPE_COLORS = {
  deadline: { bg: 'rgba(239,68,68,0.12)', color: 'var(--color-danger)', label: 'Deadline' },
  closing: { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', label: 'Closing' },
  review: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', label: 'Review' },
  filing: { bg: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)', label: 'Filing' },
  negotiation: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', label: 'Negotiation' },
  financial: { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', label: 'Financial' },
}

const PRIORITY_DOT = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
}

export default function TimelinePage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Timeline</h1>
        <p className="page-subtitle">Upcoming deadlines, milestones, and key dates across all deals</p>
      </div>

      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 11, top: 8, bottom: 8,
          width: 2, background: 'var(--color-border)', borderRadius: 2,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {TIMELINE_EVENTS.map((event) => {
            const typeStyle = TYPE_COLORS[event.type] || TYPE_COLORS.review
            return (
              <div key={event.id} style={{ position: 'relative' }}>
                {/* Dot on line */}
                <div style={{
                  position: 'absolute', left: -27, top: 4,
                  width: 12, height: 12, borderRadius: '50%',
                  background: PRIORITY_DOT[event.priority],
                  border: '2px solid var(--color-bg)',
                  boxShadow: `0 0 0 2px ${PRIORITY_DOT[event.priority]}33`,
                }} />

                <div className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                          background: typeStyle.bg, color: typeStyle.color,
                        }}>
                          {typeStyle.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{event.date}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{event.title}</h3>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>
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
    </div>
  )
}
