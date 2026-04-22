import { useState, useEffect, useRef, useCallback } from 'react'
import DocumentUpload from './components/DocumentUpload.jsx'
import AnalysisChat from './components/AnalysisChat.jsx'
import { Icon } from './components/Icons.jsx'
import DealsPage from './components/pages/DealsPage.jsx'
import DocumentsPage from './components/pages/DocumentsPage.jsx'
import TimelinePage from './components/pages/TimelinePage.jsx'
import IntegrationPage from './components/pages/IntegrationPage.jsx'
import TeamPage from './components/pages/TeamPage.jsx'
import SettingsPage from './components/pages/SettingsPage.jsx'
import { getActiveAiModel, getAiProviderLabel, loadAppSettings } from './utils/appSettings.js'
import './App.css'

const SIDEBAR_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'deals', label: 'Deal Analysis', badge: '4' },
      { id: 'documents', label: 'Documents' },
      { id: 'timeline', label: 'Timeline', badge: '2' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { id: 'email', label: 'Email (Gmail)' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'notion', label: 'Notion' },
      { id: 'linear', label: 'Linear' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'team', label: 'Team' },
      { id: 'settings', label: 'Settings' },
    ],
  },
]

const DEALS = [
  {
    id: 1,
    title: 'Series B — Acme Corp',
    status: 'active',
    description: 'Due diligence review for $45M Series B financing round. 12 documents pending review.',
    docs: 24,
    parties: 4,
    updated: '2h ago',
    progress: 72,
  },
  {
    id: 2,
    title: 'Asset Purchase — NovaTech',
    status: 'review',
    description: 'Asset purchase agreement analysis. Key terms extracted, awaiting partner sign-off.',
    docs: 18,
    parties: 3,
    updated: '4h ago',
    progress: 55,
  },
  {
    id: 3,
    title: 'IP License — Meridian Labs',
    status: 'pending',
    description: 'Cross-license negotiation for patent portfolio. Clause comparison in progress.',
    docs: 9,
    parties: 2,
    updated: '1d ago',
    progress: 30,
  },
  {
    id: 4,
    title: 'Merger Review — Helios + Prism',
    status: 'active',
    description: 'Regulatory filing preparation and antitrust risk assessment for horizontal merger.',
    docs: 42,
    parties: 6,
    updated: '30m ago',
    progress: 88,
  },
]

const INTEGRATIONS = [
  { id: 'gmail', name: 'Gmail', description: 'Email sync & thread tracking' },
  { id: 'gcal', name: 'Google Calendar', description: 'Meeting scheduling & deadlines' },
  { id: 'notion', name: 'Notion', description: 'Knowledge base & wiki' },
  { id: 'linear', name: 'Linear', description: 'Issue tracking & workflows' },
  { id: 'supabase', name: 'Supabase', description: 'Database & auth' },
  { id: 'netlify', name: 'Netlify', description: 'Deploy & hosting' },
  { id: 'github', name: 'GitHub', description: 'Code & version control' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'Edge & storage' },
]

const ACTIVITY = [
  { id: 1, text: <><strong>Sarah Chen</strong> uploaded <strong>Term Sheet v4.pdf</strong></>, deal: 'Acme Corp', time: '2 min ago', color: '#6366f1' },
  { id: 2, text: <><strong>Marcus Liu</strong> completed review of <strong>NovaTech APA Draft</strong></>, deal: 'NovaTech', time: '41 min ago', color: '#22c55e' },
  { id: 3, text: <><strong>AI Analysis</strong> flagged 3 non-standard clauses in <strong>Merger Agreement</strong></>, deal: 'Helios + Prism', time: '1h ago', color: '#f59e0b' },
  { id: 4, text: <><strong>James Okafor</strong> added a note to <strong>DOJ Filing</strong></>, deal: 'Helios + Prism', time: '3h ago', color: '#6366f1' },
  { id: 5, text: <><strong>Priya Nair</strong> started negotiation session for <strong>Meridian IP License</strong></>, deal: 'Meridian Labs', time: '5h ago', color: '#a855f7' },
]

const STATS = [
  { label: 'Active Deals', value: '4', change: '+1 this week', variant: 'accent', iconName: 'deals' },
  { label: 'Documents', value: '93', change: '+12 today', variant: 'success', iconName: 'documents' },
  { label: 'Team Members', value: '5', change: 'All active', variant: 'warning', iconName: 'team' },
  { label: 'Deadlines', value: '2', change: 'Next 7 days', variant: 'cyan', iconName: 'timeline' },
]

const INTEGRATION_IDS = new Set(['email', 'calendar', 'notion', 'linear', 'supabase', 'netlify', 'github', 'cloudflare'])

const NOTIFICATIONS = [
  { id: 1, text: 'AI flagged 3 non-standard clauses in Merger Agreement', deal: 'Helios + Prism', time: '1h ago', color: '#f59e0b', read: false },
  { id: 2, text: 'Term Sheet v4.pdf uploaded by Sarah Chen', deal: 'Acme Corp', time: '2 min ago', color: '#6366f1', read: false },
  { id: 3, text: 'Marcus Liu completed review of NovaTech APA Draft', deal: 'NovaTech', time: '41 min ago', color: '#22c55e', read: true },
  { id: 4, text: 'Closing deadline in 7 days — Series B Acme Corp', deal: 'Acme Corp', time: '2h ago', color: '#ef4444', read: true },
]

function App() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [loadedDocument, setLoadedDocument] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [appSettings, setAppSettings] = useState(() => loadAppSettings())
  const searchRef = useRef(null)
  const notifRef = useRef(null)

  const handleDocumentLoaded = (doc) => {
    setLoadedDocument(doc)
    setShowAnalysis(true)
  }

  const handleBackToDashboard = () => {
    setShowAnalysis(false)
    setLoadedDocument(null)
  }

  const handleSidebarClick = (itemId) => {
    setActiveItem(itemId)
    setShowSearchDropdown(false)
    setShowNotifications(false)
    if (itemId !== 'dashboard') {
      setShowAnalysis(false)
      setLoadedDocument(null)
    }
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const syncSettings = (event) => {
      if (event?.detail) {
        setAppSettings(event.detail)
        return
      }

      setAppSettings(loadAppSettings())
    }

    window.addEventListener('compass:settings-updated', syncSettings)
    window.addEventListener('storage', syncSettings)
    return () => {
      window.removeEventListener('compass:settings-updated', syncSettings)
      window.removeEventListener('storage', syncSettings)
    }
  }, [])

  useEffect(() => {
    const titles = {
      dashboard: 'Dashboard — Compass AI',
      deals: 'Deal Analysis — Compass AI',
      documents: 'Documents — Compass AI',
      timeline: 'Timeline — Compass AI',
      email: 'Email — Compass AI',
      calendar: 'Calendar — Compass AI',
      notion: 'Notion — Compass AI',
      linear: 'Linear — Compass AI',
      supabase: 'Supabase — Compass AI',
      netlify: 'Netlify — Compass AI',
      github: 'GitHub — Compass AI',
      cloudflare: 'Cloudflare — Compass AI',
      team: 'Team — Compass AI',
      settings: 'Settings — Compass AI',
    }
    document.title = titles[activeItem] || 'Compass AI — Your AI-Powered Legal Intelligence Agent'
  }, [activeItem])

  const searchResults = searchValue.trim().length > 0
    ? [
        ...DEALS.filter(d =>
          d.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          d.description.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 4).map(d => ({ type: 'deal', id: d.id, title: d.title, sub: d.description, nav: 'deals' })),
        ...INTEGRATIONS.filter(i =>
          i.name.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 2).map(i => ({ type: 'integration', id: i.id, title: i.name, sub: i.description, nav: i.id === 'gcal' ? 'calendar' : i.id })),
      ]
    : []

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const renderMainContent = () => {
    if (activeItem === 'dashboard' && showAnalysis && loadedDocument) {
      return <AnalysisChat document={loadedDocument} onBack={handleBackToDashboard} />
    }

    if (activeItem === 'deals') return <DealsPage />
    if (activeItem === 'documents') return <DocumentsPage />
    if (activeItem === 'timeline') return <TimelinePage />
    if (INTEGRATION_IDS.has(activeItem)) return <IntegrationPage integrationId={activeItem} />
    if (activeItem === 'team') return <TeamPage />
    if (activeItem === 'settings') return <SettingsPage />

    // Default: dashboard
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            AI-powered legal intelligence workspace · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          {STATS.map((stat) => (
            <div key={stat.label} className={`stat-card ${stat.variant}`}>
              <div className="stat-top">
                <span className="stat-label">{stat.label}</span>
                <div className={`stat-icon ${stat.variant}`}>
                  <Icon name={stat.iconName} />
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.variant === 'danger' ? 'neutral' : 'up'}`}>
                ↑ {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Analyze Document</h2>
          </div>
          <DocumentUpload
            onDocumentLoaded={handleDocumentLoaded}
            aiProviderLabel={getAiProviderLabel(appSettings.aiProvider)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Active Deals</h2>
                <button className="section-link" onClick={() => handleSidebarClick('deals')}>
                  View all →
                </button>
              </div>
              <div className="cards-grid">
                {DEALS.map((deal) => (
                  <div
                    key={deal.id}
                    className="card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSidebarClick('deals')}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open deal: ${deal.title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSidebarClick('deals') }}
                  >
                    <div className="card-header">
                      <h3 className="card-title">{deal.title}</h3>
                      <span className={`card-status ${deal.status}`}>
                        {deal.status}
                      </span>
                    </div>
                    <p className="card-description">{deal.description}</p>
                    <div className="card-meta">
                      <span className="card-meta-item">{deal.docs} docs</span>
                      <span className="card-meta-item">{deal.parties} parties</span>
                      <span className="card-meta-item">{deal.updated}</span>
                    </div>
                    <div className="deal-progress">
                      <div
                        className={`deal-progress-bar ${deal.status}`}
                        style={{ width: `${deal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <div className="card" style={{ padding: '8px 0' }}>
                <div className="activity-feed">
                  {ACTIVITY.map((item) => (
                    <div key={item.id} className="activity-item">
                      <div
                        className="activity-dot"
                        style={{ background: item.color }}
                      />
                      <div className="activity-content">
                        <div className="activity-text">{item.text}</div>
                        <div className="activity-time">{item.deal} · {item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">MCP Integrations</h2>
            <button className="section-link" onClick={() => handleSidebarClick('email')}>
              Configure →
            </button>
          </div>
          <div className="integrations-grid">
            {INTEGRATIONS.map((integration) => (
              <div
                key={integration.id}
                className="integration-card"
                onClick={() => handleSidebarClick(integration.id === 'gcal' ? 'calendar' : integration.id)}
                role="button"
                tabIndex={0}
                aria-label={`Configure ${integration.name} integration`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSidebarClick(integration.id === 'gcal' ? 'calendar' : integration.id)
                  }
                }}
              >
                <div className="integration-icon" aria-hidden="true"><Icon name={integration.id} /></div>
                <div className="integration-info">
                  <h4>{integration.name}</h4>
                  <p>{integration.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="header" role="banner">
        <div className="header-left">
          <div className="logo">
            <span className="logo-dot" aria-hidden="true" />
            Compass <span className="logo-ai">AI</span>
          </div>
          <div className="header-search" role="search" ref={searchRef}>
            <span className="header-search-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="search"
              className="header-search-input"
              placeholder="Search deals, documents…"
              value={searchValue}
              onChange={e => { setSearchValue(e.target.value); setShowSearchDropdown(true) }}
              onFocus={() => setShowSearchDropdown(true)}
              aria-label="Search"
              aria-autocomplete="list"
              aria-expanded={showSearchDropdown && searchResults.length > 0}
            />
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown" role="listbox" aria-label="Search results">
                {searchResults.map((r) => (
                  <button
                    key={`${r.type}-${r.id}`}
                    type="button"
                    className="search-result-item"
                    role="option"
                    onClick={() => {
                      handleSidebarClick(r.nav)
                      setSearchValue('')
                      setShowSearchDropdown(false)
                    }}
                  >
                    <span className="search-result-type">{r.type === 'deal' ? '⚡' : '⚙'}</span>
                    <span className="search-result-body">
                      <span className="search-result-title">{r.title}</span>
                      <span className="search-result-sub">{r.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {showSearchDropdown && searchValue.trim().length > 0 && searchResults.length === 0 && (
              <div className="search-dropdown">
                <div className="search-no-results">No results for &ldquo;{searchValue}&rdquo;</div>
              </div>
            )}
          </div>
        </div>
        <div className="header-right">
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="header-icon-btn"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              title="Notifications"
              onClick={() => setShowNotifications(v => !v)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="notif-badge" aria-label={`${unreadCount} unread notifications`} />
              )}
            </button>
            {showNotifications && (
              <div className="notif-panel fade-in" role="dialog" aria-label="Notifications">
                <div className="notif-panel-header">
                  <span className="notif-panel-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button type="button" className="notif-mark-read" onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notif-item${n.read ? ' read' : ''}`}
                      onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div className="notif-dot" style={{ background: n.color }} />
                      <div className="notif-content">
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-meta">{n.deal} · {n.time}</div>
                      </div>
                      {!n.read && <div className="notif-unread-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            aria-label="Invite team member"
            onClick={() => handleSidebarClick('team')}
          >
            Invite
          </button>
          <button
            className="btn btn-primary btn-sm"
            aria-label="Create new deal"
            onClick={() => handleSidebarClick('deals')}
          >
            + New Deal
          </button>
          <div
            className="header-avatar"
            role="button"
            tabIndex={0}
            aria-label="User profile"
            onClick={() => handleSidebarClick('settings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSidebarClick('settings') }}
          >
            SC
          </div>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar" aria-label="Main navigation">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="sidebar-section" role="group" aria-label={section.title}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                  aria-label={item.label}
                  aria-current={activeItem === item.id ? 'page' : undefined}
                >
                  <span className="sidebar-icon" aria-hidden="true"><Icon name={item.id} /></span>
                  {item.label}
                  {item.badge && (
                    <span className="sidebar-badge" aria-label={`${item.badge} items`}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '0 10px' }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent-soft)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent-hover)', marginBottom: 4 }}>
                ✦ AI Ready
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {`${getAiProviderLabel(appSettings.aiProvider)} · ${getActiveAiModel(appSettings)} · Upload a document to start analysis`}
              </div>
            </div>
          </div>
        </nav>

        <main className="main" id="main-content">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}

export default App
