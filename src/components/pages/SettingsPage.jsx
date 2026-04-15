import { useState } from 'react'
import PropTypes from 'prop-types'

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('My Legal Workspace')
  const [aiModel, setAiModel] = useState('claude-sonnet')
  const [maxTokens, setMaxTokens] = useState('4096')
  const [notifications, setNotifications] = useState(true)
  const [dealAlerts, setDealAlerts] = useState(true)
  const [autoAnalyze, setAutoAnalyze] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ai', label: 'AI Config' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api', label: 'API & Keys' },
  ]

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your Compass AI workspace</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--color-accent-hover)' : 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all var(--transition)',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activeTab === 'general' && (
          <>
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Workspace</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <FieldRow label="Workspace Name" hint="Displayed in the header and shared with your team">
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={e => setWorkspaceName(e.target.value)}
                    className="settings-input"
                  />
                </FieldRow>
                <FieldRow label="Time Zone" hint="Used for deadline and calendar calculations">
                  <select className="settings-input">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Singapore (SGT)</option>
                  </select>
                </FieldRow>
                <FieldRow label="Date Format" hint="How dates appear throughout the interface">
                  <select className="settings-input">
                    <option>MMM D, YYYY (Apr 15, 2026)</option>
                    <option>MM/DD/YYYY (04/15/2026)</option>
                    <option>DD/MM/YYYY (15/04/2026)</option>
                    <option>YYYY-MM-DD (2026-04-15)</option>
                  </select>
                </FieldRow>
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Appearance</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <FieldRow label="Accent Color" hint="Primary brand color used throughout the UI">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { color: '#6366f1', label: 'Indigo' },
                      { color: '#8b5cf6', label: 'Violet' },
                      { color: '#06b6d4', label: 'Cyan' },
                      { color: '#22c55e', label: 'Green' },
                      { color: '#f59e0b', label: 'Amber' },
                    ].map(c => (
                      <button
                        key={c.color}
                        type="button"
                        title={c.label}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: c.color,
                          border: c.color === '#6366f1' ? '3px solid white' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'transform var(--transition)',
                        }}
                        aria-label={`Set accent color to ${c.label}`}
                      />
                    ))}
                  </div>
                </FieldRow>
                <FieldRow label="Sidebar Width" hint="Controls the navigation sidebar width">
                  <select className="settings-input">
                    <option>Compact (220px)</option>
                    <option>Default (240px)</option>
                    <option>Wide (280px)</option>
                  </select>
                </FieldRow>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ai' && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>AI Configuration</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <FieldRow label="Model" hint="The Claude model used for document analysis and legal reasoning">
                <select
                  value={aiModel}
                  onChange={e => setAiModel(e.target.value)}
                  className="settings-input"
                >
                  <option value="claude-opus">Claude Opus 4.5 (most capable)</option>
                  <option value="claude-sonnet">Claude Sonnet 4.5 (balanced)</option>
                  <option value="claude-haiku">Claude Haiku 4.5 (fastest)</option>
                </select>
              </FieldRow>
              <FieldRow label="Max Tokens" hint="Maximum response length per AI message (higher = more detailed)">
                <select
                  value={maxTokens}
                  onChange={e => setMaxTokens(e.target.value)}
                  className="settings-input"
                >
                  <option value="2048">2,048 — Concise</option>
                  <option value="4096">4,096 — Recommended</option>
                  <option value="8192">8,192 — Detailed</option>
                </select>
              </FieldRow>
              <FieldRow label="Analysis Language" hint="Language for AI analysis output">
                <select className="settings-input">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </FieldRow>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="Auto-analyze on Upload"
                  hint="Automatically start AI analysis when a document is uploaded"
                  value={autoAnalyze}
                  onChange={setAutoAnalyze}
                />
              </div>
            </div>

            {/* Model comparison */}
            <div style={{
              marginTop: 20, padding: '16px 18px',
              background: 'var(--color-accent-soft)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-hover)', marginBottom: 10 }}>
                ✦ Currently using: {aiModel === 'claude-opus' ? 'Claude Opus 4.5' : aiModel === 'claude-sonnet' ? 'Claude Sonnet 4.5' : 'Claude Haiku 4.5'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { label: 'Reasoning', value: aiModel === 'claude-opus' ? 100 : aiModel === 'claude-sonnet' ? 82 : 60 },
                  { label: 'Speed', value: aiModel === 'claude-opus' ? 55 : aiModel === 'claude-sonnet' ? 78 : 100 },
                  { label: 'Cost efficiency', value: aiModel === 'claude-opus' ? 40 : aiModel === 'claude-sonnet' ? 72 : 100 },
                ].map(metric => (
                  <div key={metric.label}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{metric.label}</div>
                    <div style={{ height: 4, background: 'rgba(99,102,241,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${metric.value}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Notifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <ToggleRow
                label="Email Notifications"
                hint="Receive email summaries when analysis completes"
                value={notifications}
                onChange={setNotifications}
              />
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="Deal Deadline Alerts"
                  hint="Get notified 48h before deal milestones"
                  value={dealAlerts}
                  onChange={setDealAlerts}
                />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="Team Activity Digest"
                  hint="Daily summary of team actions on shared deals"
                  value={false}
                  onChange={() => {}}
                />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="AI Risk Flags"
                  hint="Instant notification when AI detects high-risk clauses"
                  value={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <>
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Anthropic API Key</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                Your API key is used to power Claude AI document analysis. It is never logged or shared.
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="settings-input"
                  placeholder="sk-ant-api03-…"
                  style={{ paddingRight: 80 }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(v => !v)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--color-text-muted)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 500,
                    padding: '2px 6px',
                  }}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
                Get your API key at{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                  console.anthropic.com
                </a>
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Usage</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                Current period usage for your workspace.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'API Calls', value: '1,247', color: 'var(--color-accent)' },
                  { label: 'Tokens Used', value: '2.1M', color: 'var(--color-cyan)' },
                  { label: 'Est. Cost', value: '$12.40', color: 'var(--color-success)' },
                ].map(u => (
                  <div key={u.label} style={{
                    padding: '14px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-hover)',
                    border: '1px solid var(--color-border)', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: u.color, letterSpacing: '-0.03em', marginBottom: 2 }}>{u.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ padding: 28, borderColor: 'rgba(239,68,68,0.2)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--color-danger)' }}>Danger Zone</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                These actions are irreversible. Please proceed with caution.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost btn-sm" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}>
                  Delete All Deals
                </button>
                <button type="button" className="btn btn-ghost btn-sm" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}>
                  Reset Workspace
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="btn btn-ghost btn-sm">Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" style={{ minWidth: 120 }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldRow({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{label}</p>
        {hint && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{hint}</p>}
      </div>
      {children}
    </div>
  )
}

FieldRow.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node.isRequired,
}

function ToggleRow({ label, hint, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{label}</p>
        {hint && <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? 'var(--color-accent)' : 'var(--color-border)',
          border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 0.2s',
          flexShrink: 0,
          boxShadow: value ? '0 0 0 2px rgba(99,102,241,0.2)' : 'none',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2, left: value ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          display: 'block',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )
}

ToggleRow.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
