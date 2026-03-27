import { useState, useEffect } from 'react'
import DocumentUpload from './components/DocumentUpload.jsx'
import AnalysisChat from './components/AnalysisChat.jsx'
import './App.css'

const SIDEBAR_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', icon: '~', label: 'Dashboard', active: true },
      { id: 'deals', icon: '>', label: 'Deal Analysis' },
      { id: 'documents', icon: '#', label: 'Documents' },
      { id: 'timeline', icon: '|', label: 'Timeline' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { id: 'email', icon: '@', label: 'Email (Gmail)' },
      { id: 'calendar', icon: '+', label: 'Calendar' },
      { id: 'notion', icon: 'N', label: 'Notion' },
      { id: 'linear', icon: 'L', label: 'Linear' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'team', icon: '*', label: 'Team' },
      { id: 'settings', icon: '%', label: 'Settings' },
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
  { id: 'gmail', icon: '@', name: 'Gmail', description: 'Email sync & thread tracking' },
  { id: 'gcal', icon: '+', name: 'Google Calendar', description: 'Meeting scheduling & deadlines' },
  { id: 'notion', icon: 'N', name: 'Notion', description: 'Knowledge base & wiki' },
  { id: 'linear', icon: 'L', name: 'Linear', description: 'Issue tracking & workflows' },
  { id: 'supabase', icon: 'S', name: 'Supabase', description: 'Database & auth' },
  { id: 'netlify', icon: '^', name: 'Netlify', description: 'Deploy & hosting' },
  { id: 'github', icon: '/', name: 'GitHub', description: 'Code & version control' },
  { id: 'cloudflare', icon: 'C', name: 'Cloudflare', description: 'Edge & storage' },
]

function App() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [loadedDocument, setLoadedDocument] = useState(null)
  const [view, setView] = useState('dashboard')

  const handleDocumentLoaded = (doc) => {
    setLoadedDocument(doc)
    setView('analysis')
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
  }

  useEffect(() => {
    const titles = {
      dashboard: 'Dashboard — Compass AI',
      analysis: 'Document Analysis — Compass AI',
    }
    document.title = titles[view] || 'Compass AI — Your AI-Powered Legal Intelligence Agent'
  }, [view])

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
          <button className="btn btn-ghost">Invite</button>
          <button className="btn btn-primary">+ New Deal</button>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar" aria-label="Main navigation">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="sidebar-section" role="group" aria-label={section.title}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => setActiveItem(item.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveItem(item.id) } }}
                  role="button"
                  tabIndex={0}
                  aria-current={activeItem === item.id ? 'page' : undefined}
                >
                  <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <main className="main" id="main-content">
          {view === 'analysis' && loadedDocument ? (
            <AnalysisChat document={loadedDocument} onBack={handleBackToDashboard} />
          ) : (
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
                    <div key={deal.id} className="card">
                      <div className="card-header">
                        <h3 className="card-title">{deal.title}</h3>
                        <span className={`card-status ${deal.status}`}>
                          {deal.status}
                        </span>
                      </div>
                      <p className="card-description">{deal.description}</p>
                      <div className="card-meta">
                        <span className="card-meta-item"># {deal.docs} docs</span>
                        <span className="card-meta-item">* {deal.parties} parties</span>
                        <span className="card-meta-item">~ {deal.updated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">MCP Integrations</h2>
                <div className="integrations-grid">
                  {INTEGRATIONS.map((integration) => (
                    <div key={integration.id} className="integration-card">
                      <div className="integration-icon">{integration.icon}</div>
                      <div className="integration-info">
                        <h4>{integration.name}</h4>
                        <p>{integration.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
