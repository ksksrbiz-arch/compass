import PropTypes from 'prop-types'

const s = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const DashboardIcon = () => (
  <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
)

export const DealIcon = () => (
  <svg {...s}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
)

export const DocumentIcon = () => (
  <svg {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
)

export const TimelineIcon = () => (
  <svg {...s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

export const EmailIcon = () => (
  <svg {...s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
)

export const CalendarIcon = () => (
  <svg {...s}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)

export const NotionIcon = () => (
  <svg {...s}><path d="M4 4h16v16H4z" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>
)

export const LinearIcon = () => (
  <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
)

export const TeamIcon = () => (
  <svg {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
)

export const SettingsIcon = () => (
  <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
)

export const SupabaseIcon = () => (
  <svg {...s}><path d="M4 6l8-4 8 4v8l-8 4-8-4z"/><path d="M12 22V10"/><path d="M4 6l8 4"/><path d="M20 6l-8 4"/></svg>
)

export const DeployIcon = () => (
  <svg {...s}><path d="M12 2L2 19h20L12 2z"/><path d="M12 9v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
)

export const GitHubIcon = () => (
  <svg {...s}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
)

export const CloudIcon = () => (
  <svg {...s}><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
)

export const UploadIcon = () => (
  <svg {...s} width="24" height="24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
)

export const ArrowDownIcon = () => (
  <svg {...s} width="24" height="24"><polyline points="7 10 12 15 17 10"/></svg>
)

const ICON_MAP = {
  dashboard: DashboardIcon,
  deals: DealIcon,
  documents: DocumentIcon,
  timeline: TimelineIcon,
  email: EmailIcon,
  calendar: CalendarIcon,
  notion: NotionIcon,
  linear: LinearIcon,
  team: TeamIcon,
  settings: SettingsIcon,
  gmail: EmailIcon,
  gcal: CalendarIcon,
  supabase: SupabaseIcon,
  netlify: DeployIcon,
  github: GitHubIcon,
  cloudflare: CloudIcon,
}

export function Icon({ name }) {
  const Comp = ICON_MAP[name]
  return Comp ? <Comp /> : null
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
}
