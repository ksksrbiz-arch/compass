import PropTypes from 'prop-types'
import { Icon } from '../Icons.jsx'

const INTEGRATION_DETAILS = {
  email: {
    name: 'Gmail',
    icon: 'email',
    description: 'Sync deal-related email threads, automatically surface relevant messages, and link correspondence to deals.',
    features: [
      'Automatic thread tagging by deal or party',
      'Surface emails relevant to open deal items',
      'Draft and send from within Compass',
      'Attachment extraction into Documents',
    ],
    status: 'connect',
    color: '#EA4335',
  },
  calendar: {
    name: 'Google Calendar',
    icon: 'calendar',
    description: 'Sync meetings, deadlines, and milestones. Compass will automatically create calendar events for key deal dates.',
    features: [
      'Auto-create events for deal deadlines',
      'Meeting prep: pull relevant docs before calls',
      'Sync Timeline items to your calendar',
      'Invite co-counsel and counterparties',
    ],
    status: 'connect',
    color: '#4285F4',
  },
  notion: {
    name: 'Notion',
    icon: 'notion',
    description: 'Push deal summaries, clause extracts, and analysis results directly into your Notion workspace.',
    features: [
      'Export deal summaries to Notion pages',
      'Sync due diligence checklists',
      'Link Notion databases to deals',
      'Real-time two-way updates',
    ],
    status: 'connect',
    color: '#000000',
  },
  linear: {
    name: 'Linear',
    icon: 'linear',
    description: 'Convert deal action items and open issues into Linear tickets for structured workflow tracking.',
    features: [
      'Create Linear issues from deal action items',
      'Sync completion status back to Compass',
      'Assign tickets to team members',
      'Link issues to specific document clauses',
    ],
    status: 'connect',
    color: '#5E6AD2',
  },
}

export default function IntegrationPage({ integrationId }) {
  const integration = INTEGRATION_DETAILS[integrationId]

  if (!integration) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Integration</h1>
          <p className="page-subtitle">This integration is not yet available.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{integration.name}</h1>
        <p className="page-subtitle">{integration.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon name={integration.icon} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Connect {integration.name}</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            {integration.description}
          </p>
          <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Connect {integration.name}
          </button>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>What you&rsquo;ll get</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {integration.features.map((feature) => (
              <div key={feature} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  color: 'var(--color-success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1, fontSize: 10, fontWeight: 700,
                }}>✓</span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(245,158,11,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-warning)', fontSize: 16, flexShrink: 0,
          }}>⚠</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>OAuth connection required</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              You&rsquo;ll be redirected to {integration.name} to authorize Compass AI. We only request the minimum permissions needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

IntegrationPage.propTypes = {
  integrationId: PropTypes.string.isRequired,
}
