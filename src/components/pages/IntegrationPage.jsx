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
    setupUrl: 'https://accounts.google.com/signin',
    docsUrl: 'https://support.google.com/mail/?hl=en#topic=7065107',
    setupLabel: 'Open Gmail sign-in',
    docsLabel: 'Open Gmail help center',
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
    setupUrl: 'https://calendar.google.com',
    docsUrl: 'https://support.google.com/calendar/',
    setupLabel: 'Open Google Calendar',
    docsLabel: 'Open Calendar help center',
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
    setupUrl: 'https://www.notion.so/profile/integrations',
    docsUrl: 'https://www.notion.so/help/category/integrations-api-and-embeds',
    setupLabel: 'Open Notion integrations',
    docsLabel: 'Open Notion docs',
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
    setupUrl: 'https://linear.app/login',
    docsUrl: 'https://linear.app/docs/integrations/overview',
    setupLabel: 'Open Linear workspace',
    docsLabel: 'Open Linear docs',
  },
  supabase: {
    name: 'Supabase',
    icon: 'supabase',
    description: 'Use Supabase for application data, auth, and storage backing services used by Compass.',
    features: [
      'Provision auth providers and secure sessions',
      'Back shared deal data with Postgres',
      'Store extracted documents and metadata',
      'Support row-level security for workspace access',
    ],
    setupUrl: 'https://supabase.com/dashboard/projects',
    docsUrl: 'https://supabase.com/docs',
    setupLabel: 'Open Supabase dashboard',
    docsLabel: 'Open Supabase docs',
  },
  netlify: {
    name: 'Netlify',
    icon: 'netlify',
    description: 'Manage frontend deployments, previews, and environment configuration for Compass.',
    features: [
      'Review and publish frontend deploys',
      'Manage site environment variables',
      'Use preview deploys for QA',
      'Inspect build logs and runtime settings',
    ],
    setupUrl: 'https://app.netlify.com',
    docsUrl: 'https://docs.netlify.com',
    setupLabel: 'Open Netlify app',
    docsLabel: 'Open Netlify docs',
  },
  github: {
    name: 'GitHub',
    icon: 'github',
    description: 'Manage source control, pull requests, workflow automation, and developer access.',
    features: [
      'Review pull requests and CI status',
      'Configure repository and app access',
      'Monitor workflow automation',
      'Track issues linked to deal work',
    ],
    setupUrl: 'https://github.com/login',
    docsUrl: 'https://docs.github.com',
    setupLabel: 'Open GitHub',
    docsLabel: 'Open GitHub docs',
  },
  cloudflare: {
    name: 'Cloudflare',
    icon: 'cloudflare',
    description: 'Configure DNS, edge delivery, and storage services that support Compass deployments.',
    features: [
      'Manage DNS and edge routing',
      'Inspect cache and CDN behavior',
      'Configure secure origins and tunnels',
      'Access storage and edge compute services',
    ],
    setupUrl: 'https://dash.cloudflare.com',
    docsUrl: 'https://developers.cloudflare.com',
    setupLabel: 'Open Cloudflare dashboard',
    docsLabel: 'Open Cloudflare docs',
  },
}

export default function IntegrationPage({ integrationId }) {
  const integration = INTEGRATION_DETAILS[integrationId]
  const [lastAction, setLastAction] = useState('')

  const handleOpen = (url, label) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setLastAction(`${label} opened in a new tab.`)
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
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20,
              background: 'var(--color-accent-soft)', color: 'var(--color-accent-hover)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              Ready to configure
            </span>
          </div>
        </div>
        <p className="page-subtitle">{integration.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--color-accent-soft)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon name={integration.icon} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Open a real setup action</h3>
          <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            Use the official provider links below instead of placeholder actions or dead docs routes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}
              onClick={() => handleOpen(integration.setupUrl, integration.setupLabel)}
            >
              {integration.setupLabel}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => handleOpen(integration.docsUrl, integration.docsLabel)}
            >
              {integration.docsLabel}
            </button>
          </div>
          {lastAction && (
            <div style={{
              marginTop: 16,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--color-success-soft)',
              border: '1px solid rgba(34,197,94,0.15)',
              fontSize: 12.5,
              color: 'var(--color-success)',
              fontWeight: 500,
            }}>
              {lastAction}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>What you&rsquo;ll get</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {integration.features.map((feature, idx) => (
              <div key={feature} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 700,
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--color-warning-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-warning)', fontSize: 18, flexShrink: 0,
          }}>↗</div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>Official resources only</p>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
              Compass now routes this page to live provider destinations instead of 404 documentation placeholders.
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
