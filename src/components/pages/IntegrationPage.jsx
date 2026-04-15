import { useState } from 'react'
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
    color: '#EA4335',
    docsUrl: 'https://docs.compass-ai.io/integrations/gmail',
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
    color: '#4285F4',
    docsUrl: 'https://docs.compass-ai.io/integrations/calendar',
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
    color: '#e2e2e2',
    docsUrl: 'https://docs.compass-ai.io/integrations/notion',
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
    color: '#5E6AD2',
    docsUrl: 'https://docs.compass-ai.io/integrations/linear',
  },
}

export default function IntegrationPage({ integrationId }) {
  const integration = INTEGRATION_DETAILS[integrationId]
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  const handleConnect = () => {
    setConnecting(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 2000)
  }

  if (!integration) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">Integration</h1>
          <p className="page-subtitle">This integration is not yet available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--color-accent-soft)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={integration.icon} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{integration.name}</h1>
            {connected && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20,
                background: 'var(--color-success-soft)', color: 'var(--color-success)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                ✓ Connected
              </span>
            )}
          </div>
        </div>
        <p className="page-subtitle">{integration.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Connect card */}
        <div className="card" style={{ padding: 28 }}>
          {connected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--color-success-soft)',
                border: '1px solid rgba(34,197,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: 'var(--color-success)', marginBottom: 4,
              }}>✓</div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{integration.name} Connected</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Your {integration.name} account is linked. Compass AI will now sync and surface relevant data automatically.
              </p>
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                background: 'var(--color-success-soft)',
                border: '1px solid rgba(34,197,94,0.15)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 2 }}>
                  Active since just now
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Last sync: syncing now…
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)', width: '100%', justifyContent: 'center' }}
                onClick={() => setConnected(false)}
              >
                Disconnect {integration.name}
              </button>
            </div>
          ) : (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--color-accent-soft)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Icon name={integration.icon} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Connect {integration.name}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
                {integration.description}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <span style={{
                      width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite', display: 'inline-block',
                    }} />
                    Connecting…
                  </>
                ) : `Connect ${integration.name}`}
              </button>
            </>
          )}
        </div>

        {/* Features card */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>What you&rsquo;ll get</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {integration.features.map((feature, idx) => (
              <div key={feature} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: connected ? 'var(--color-success-soft)' : 'var(--color-accent-soft)',
                  color: connected ? 'var(--color-success)' : 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 700,
                  border: `1px solid ${connected ? 'rgba(34,197,94,0.2)' : 'rgba(99,102,241,0.2)'}`,
                  transition: 'all 0.3s ease',
                  transitionDelay: `${idx * 0.1}s`,
                }}>
                  {connected ? '✓' : idx + 1}
                </span>
                <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!connected && (
        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--color-warning-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-warning)', fontSize: 18, flexShrink: 0,
            }}>⚠</div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>OAuth connection required</p>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
                You&rsquo;ll be redirected to {integration.name} to authorize Compass AI. We only request the minimum permissions needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {connected && (
        <div className="card" style={{ padding: '18px 22px', borderColor: 'rgba(34,197,94,0.15)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Integration Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Status', value: 'Connected', color: 'var(--color-success)' },
              { label: 'Permissions', value: 'Read + Write', color: 'var(--color-accent)' },
              { label: 'Sync', value: 'Real-time', color: 'var(--color-cyan)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

IntegrationPage.propTypes = {
  integrationId: PropTypes.string.isRequired,
}
