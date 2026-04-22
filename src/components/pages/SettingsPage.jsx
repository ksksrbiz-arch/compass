import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  DEFAULT_APP_SETTINGS,
  clearAppSettings,
  getActiveAiModel,
  getAiProviderLabel,
  loadAppSettings,
  saveAppSettings,
} from '../../utils/appSettings.js'

const ACCENT_COLORS = [
  { color: '#6366f1', label: 'Indigo', hover: '#818cf8', soft: 'rgba(99,102,241,0.12)', glow: 'rgba(99,102,241,0.25)' },
  { color: '#8b5cf6', label: 'Violet', hover: '#a78bfa', soft: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.25)' },
  { color: '#06b6d4', label: 'Cyan', hover: '#22d3ee', soft: 'rgba(6,182,212,0.12)', glow: 'rgba(6,182,212,0.25)' },
  { color: '#22c55e', label: 'Green', hover: '#4ade80', soft: 'rgba(34,197,94,0.12)', glow: 'rgba(34,197,94,0.25)' },
  { color: '#f59e0b', label: 'Amber', hover: '#fbbf24', soft: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.25)' },
]

function normalizeSettings(settings) {
  return {
    ...DEFAULT_APP_SETTINGS,
    ...settings,
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => normalizeSettings(loadAppSettings()))
  const [showAnthropicApiKey, setShowAnthropicApiKey] = useState(false)
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    const variant = ACCENT_COLORS.find(c => c.color === settings.accentColor)
    if (!variant) return
    const root = document.documentElement
    root.style.setProperty('--color-accent', settings.accentColor)
    root.style.setProperty('--color-accent-hover', variant.hover)
    root.style.setProperty('--color-accent-soft', variant.soft)
    root.style.setProperty('--color-accent-glow', variant.glow)
  }, [settings.accentColor])

  const setField = (field) => (eOrValue) => {
    const value = typeof eOrValue === 'object' && eOrValue?.target
      ? eOrValue.target.value
      : eOrValue

    setSettings(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    saveAppSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setSettings(normalizeSettings(loadAppSettings()))
    setSaved(false)
  }

  const handleClearApiKeys = () => {
    const nextSettings = {
      ...settings,
      anthropicApiKey: '',
      geminiApiKey: '',
    }

    setSettings(nextSettings)
    saveAppSettings(nextSettings)
    setSaved(false)
  }

  const handleResetWorkspace = () => {
    clearAppSettings()
    setSettings({ ...DEFAULT_APP_SETTINGS })
    setSaved(false)
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ai', label: 'AI Config' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api', label: 'API & Keys' },
  ]

  const activeModel = getActiveAiModel(settings)

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your Compass AI workspace</p>
      </div>

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
                    value={settings.workspaceName}
                    onChange={setField('workspaceName')}
                    className="settings-input"
                  />
                </FieldRow>
                <FieldRow label="Time Zone" hint="Used for deadline and calendar calculations">
                  <select className="settings-input" defaultValue="America/New_York (EST)">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Singapore (SGT)</option>
                  </select>
                </FieldRow>
                <FieldRow label="Date Format" hint="How dates appear throughout the interface">
                  <select className="settings-input" defaultValue="MMM D, YYYY (Apr 15, 2026)">
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
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.color}
                        type="button"
                        title={c.label}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: c.color,
                          border: c.color === settings.accentColor ? '3px solid white' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'transform var(--transition)',
                          outline: c.color === settings.accentColor ? `2px solid ${c.color}` : 'none',
                          outlineOffset: 2,
                        }}
                        onClick={() => setField('accentColor')(c.color)}
                        aria-label={`Set accent color to ${c.label}`}
                        aria-pressed={c.color === settings.accentColor}
                      />
                    ))}
                  </div>
                </FieldRow>
                <FieldRow label="Sidebar Width" hint="Controls the navigation sidebar width">
                  <select className="settings-input" defaultValue="Default (240px)">
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
              <FieldRow label="Provider" hint="Choose which provider powers document analysis across the app">
                <select
                  value={settings.aiProvider}
                  onChange={setField('aiProvider')}
                  className="settings-input"
                >
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </FieldRow>
              <FieldRow label="Model" hint="Active model used for document analysis and legal reasoning">
                <select
                  value={activeModel}
                  onChange={settings.aiProvider === 'gemini' ? setField('geminiModel') : setField('anthropicModel')}
                  className="settings-input"
                >
                  {settings.aiProvider === 'gemini' ? (
                    <>
                      <option value="models/gemini-2-5-pro">Gemini 2.5 Pro (deep reasoning)</option>
                      <option value="models/gemini-2-5-flash">Gemini 2.5 Flash (fastest)</option>
                    </>
                  ) : (
                    <>
                      <option value="claude-opus-4-7">Claude Opus 4.7 (most capable)</option>
                      <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (balanced)</option>
                      <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (fastest)</option>
                    </>
                  )}
                </select>
              </FieldRow>
              <FieldRow label="Max Tokens" hint="Maximum response length per AI message (higher = more detailed)">
                <select
                  value={settings.maxTokens}
                  onChange={setField('maxTokens')}
                  className="settings-input"
                >
                  <option value="2048">2,048 — Concise</option>
                  <option value="4096">4,096 — Recommended</option>
                  <option value="8192">8,192 — Detailed</option>
                </select>
              </FieldRow>
              <FieldRow label="Analysis Language" hint="Language for AI analysis output">
                <select value={settings.analysisLanguage} onChange={setField('analysisLanguage')} className="settings-input">
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
                  value={settings.autoAnalyze}
                  onChange={setField('autoAnalyze')}
                />
              </div>
            </div>

            <div style={{
              marginTop: 20, padding: '16px 18px',
              background: 'var(--color-accent-soft)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-hover)', marginBottom: 10 }}>
                ✦ Active AI stack: {getAiProviderLabel(settings.aiProvider)} · {activeModel}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {(settings.aiProvider === 'gemini'
                  ? [
                      { label: 'Reasoning', value: activeModel.includes('pro') ? 96 : 80 },
                      { label: 'Speed', value: activeModel.includes('flash') ? 100 : 72 },
                      { label: 'Cost efficiency', value: activeModel.includes('flash') ? 95 : 70 },
                    ]
                  : [
                      { label: 'Reasoning', value: activeModel.includes('opus') ? 100 : activeModel.includes('sonnet') ? 84 : 62 },
                      { label: 'Speed', value: activeModel.includes('haiku') ? 100 : activeModel.includes('sonnet') ? 78 : 58 },
                      { label: 'Cost efficiency', value: activeModel.includes('haiku') ? 100 : activeModel.includes('sonnet') ? 72 : 42 },
                    ]).map(metric => (
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
                value={settings.notifications}
                onChange={setField('notifications')}
              />
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="Deal Deadline Alerts"
                  hint="Get notified 48h before deal milestones"
                  value={settings.dealAlerts}
                  onChange={setField('dealAlerts')}
                />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="Team Activity Digest"
                  hint="Daily summary of team actions on shared deals"
                  value={settings.teamDigest}
                  onChange={setField('teamDigest')}
                />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
                <ToggleRow
                  label="AI Risk Flags"
                  hint="Instant notification when AI detects high-risk clauses"
                  value={settings.riskFlags}
                  onChange={setField('riskFlags')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <>
            <ApiKeyCard
              title="Anthropic API Key"
              description="Used when Claude is the selected provider. The key is stored locally in this browser and sent only to your Compass backend."
              apiKey={settings.anthropicApiKey}
              onChange={setField('anthropicApiKey')}
              showApiKey={showAnthropicApiKey}
              onToggleVisibility={() => setShowAnthropicApiKey(v => !v)}
              placeholder="sk-ant-api03-…"
              docsHref="https://console.anthropic.com"
              docsLabel="console.anthropic.com"
            />

            <ApiKeyCard
              title="Google Gemini API Key"
              description="Used when Gemini is the selected provider. The key is stored locally in this browser and sent only to your Compass backend."
              apiKey={settings.geminiApiKey}
              onChange={setField('geminiApiKey')}
              showApiKey={showGeminiApiKey}
              onToggleVisibility={() => setShowGeminiApiKey(v => !v)}
              placeholder="AIzaSy…"
              docsHref="https://aistudio.google.com/app/apikey"
              docsLabel="aistudio.google.com/app/apikey"
            />

            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Usage</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                Current workspace routing configuration for AI requests.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Provider', value: getAiProviderLabel(settings.aiProvider), color: 'var(--color-accent)' },
                  { label: 'Model', value: activeModel.replace('models/', ''), color: 'var(--color-cyan)' },
                  { label: 'Max Tokens', value: settings.maxTokens, color: 'var(--color-success)' },
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

            <div className="card" style={{ padding: 28, borderColor: 'rgba(239,68,68,0.2)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--color-danger)' }}>Danger Zone</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                These actions clear locally stored workspace settings from this browser.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}
                  onClick={handleClearApiKeys}
                >
                  Clear Stored API Keys
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-danger)' }}
                  onClick={handleResetWorkspace}
                >
                  Reset Workspace Settings
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" style={{ minWidth: 120 }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ApiKeyCard({
  title,
  description,
  apiKey,
  onChange,
  showApiKey,
  onToggleVisibility,
  placeholder,
  docsHref,
  docsLabel,
}) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
        {description}
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type={showApiKey ? 'text' : 'password'}
          value={apiKey}
          onChange={onChange}
          className="settings-input"
          placeholder={placeholder}
          style={{ paddingRight: 80 }}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
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
        <a href={docsHref} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
          {docsLabel}
        </a>
      </p>
    </div>
  )
}

ApiKeyCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showApiKey: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  docsHref: PropTypes.string.isRequired,
  docsLabel: PropTypes.string.isRequired,
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
