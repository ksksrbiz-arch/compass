import { useState, useEffect } from 'react'
import DocumentUpload from './components/DocumentUpload.jsx'
import AnalysisChat from './components/AnalysisChat.jsx'
import { Icon } from './components/Icons.jsx'
import DealsPage from './components/pages/DealsPage.jsx'
import DocumentsPage from './components/pages/DocumentsPage.jsx'
import TimelinePage from './components/pages/TimelinePage.jsx'
import IntegrationPage from './components/pages/IntegrationPage.jsx'
import TeamPage from './components/pages/TeamPage.jsx'
import SettingsPage from './components/pages/SettingsPage.jsx'
import './App.css'

const SIDEBAR_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', active: true },
      { id: 'deals', label: 'Deal Analysis' },
      { id: 'documents', label: 'Documents' },
      { id: 'timeline', label: 'Timeline' },
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
  },
  {
    id: 2,
    title: 'Asset Purchase — NovaTech',
    status: 'review',
    description: 'Asset purchase agreement analysis. Key terms extracted, awaiting partner sign-off.',
    docs: 18,
    parties: 3,
    updated: '4h ago',
  },
  {
    id: 3,
    title: 'IP License — Meridian Labs',
    status: 'pending',
    description: 'Cross-license negotiation for patent portfolio. Clause comparison in progress.',
    docs: 9,
    parties: 2,
    updated: '1d ago',
  },
  {
    id: 4,
    title: 'Merger Review — Helios + Prism',
    status: 'active',
    description: 'Regulatory filing preparation and antitrust risk assessment for horizontal merger.',
    docs: 42,
    parties: 6,
    updated: '30m ago',
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

const INTEGRATION_IDS = new Set(['email', 'calendar', 'notion', 'linear'])

function App() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [loadedDocument, setLoadedDocument] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

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
    // Leaving analysis view when navigating away
    if (itemId !== 'dashboard') {
      setShowAnalysis(false)
      setLoadedDocument(null)
    }
  }

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
      team: 'Team — Compass AI',
      settings: 'Settings — Compass AI',
    }
    document.title = titles[activeItem] || 'Compass AI — Your AI-Powered Legal Intelligence Agent'
  }, [activeItem])

  const renderMainContent = () => {
    // Document analysis overlay takes priority
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
      <>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            AI-powered legal intelligence workspace for deal analysis
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">Analyze Document</h2>
          <DocumentUpload onDocumentLoaded={handleDocumentLoaded} />
        </div>

        <div className="section">
          <h2 className="section-title">Active Deals</h2>
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
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">MCP Integrations</h2>
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
      </>
    )
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="header" role="banner">
        <div className="header-left">
          <div className="logo">
            <span>&bull;</span> Compass <span className="logo-ai">AI</span>
          </div>
        </div>
        <div className="header-right">
          <button
            className="btn btn-ghost"
            aria-label="Invite team member"
            onClick={() => handleSidebarClick('team')}
          >
            Invite
          </button>
          <button
            className="btn btn-primary"
            aria-label="Create new deal"
            onClick={() => handleSidebarClick('deals')}
          >
            + New Deal
          </button>
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
                </button>
              ))}
            </div>
          ))}
        </nav>

        <main className="main" id="main-content">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}

export default App
