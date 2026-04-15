import { useState } from 'react'

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('My Legal Workspace')
  const [aiModel, setAiModel] = useState('claude-sonnet')
  const [maxTokens, setMaxTokens] = useState('4096')
  const [notifications, setNotifications] = useState(true)
  const [dealAlerts, setDealAlerts] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your Compass AI workspace</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Workspace */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Workspace</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FieldRow label="Workspace Name" hint="Displayed in the header and shared with your team">
              <input
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                className="settings-input"
              />
            </FieldRow>
          </div>
        </div>

        {/* AI Model */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>AI Configuration</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FieldRow label="Model" hint="The Claude model used for document analysis and legal reasoning">
              <select
                value={aiModel}
                onChange={e => setAiModel(e.target.value)}
                className="settings-input"
              >
                <option value="claude-opus">Claude Opus (most capable)</option>
                <option value="claude-sonnet">Claude Sonnet (balanced)</option>
                <option value="claude-haiku">Claude Haiku (fastest)</option>
              </select>
            </FieldRow>
            <FieldRow label="Max Tokens" hint="Maximum response length per AI message (higher = more detailed)">
              <select
                value={maxTokens}
                onChange={e => setMaxTokens(e.target.value)}
                className="settings-input"
              >
                <option value="2048">2,048</option>
                <option value="4096">4,096 (recommended)</option>
                <option value="8192">8,192</option>
              </select>
            </FieldRow>
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ToggleRow
              label="Email Notifications"
              hint="Receive email summaries when analysis completes"
              value={notifications}
              onChange={setNotifications}
            />
            <ToggleRow
              label="Deal Deadline Alerts"
              hint="Get notified 48h before deal milestones"
              value={dealAlerts}
              onChange={setDealAlerts}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ padding: 28, borderColor: 'rgba(239,68,68,0.2)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--color-danger)' }}>Danger Zone</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn btn-ghost" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}>
              Delete All Deals
            </button>
            <button type="button" className="btn btn-ghost" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}>
              Reset Workspace
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: 120 }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldRow({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{label}</p>
        {hint && <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{hint}</p>}
      </div>
      {children}
    </div>
  )
}

import PropTypes from 'prop-types'

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
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2, left: value ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          display: 'block',
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
