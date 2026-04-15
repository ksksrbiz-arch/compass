import { useState } from 'react'
import PropTypes from 'prop-types'

const MEMBERS = [
  {
    id: 1, name: 'Sarah Chen', role: 'Partner', email: 'sarah.chen@firm.com',
    deals: 2, avatar: 'SC', status: 'active', workload: 85,
    dealsList: ['Series B — Acme Corp', 'Merger Review — Helios + Prism'],
    joined: 'Jan 2022',
  },
  {
    id: 2, name: 'Marcus Liu', role: 'Senior Associate', email: 'marcus.liu@firm.com',
    deals: 1, avatar: 'ML', status: 'active', workload: 60,
    dealsList: ['Asset Purchase — NovaTech'],
    joined: 'Mar 2023',
  },
  {
    id: 3, name: 'Priya Nair', role: 'Associate', email: 'priya.nair@firm.com',
    deals: 1, avatar: 'PN', status: 'active', workload: 45,
    dealsList: ['IP License — Meridian Labs'],
    joined: 'Aug 2023',
  },
  {
    id: 4, name: 'James Okafor', role: 'Partner', email: 'james.okafor@firm.com',
    deals: 1, avatar: 'JO', status: 'active', workload: 92,
    dealsList: ['Merger Review — Helios + Prism'],
    joined: 'Sep 2021',
  },
  {
    id: 5, name: 'Lin Wei', role: 'Paralegal', email: 'lin.wei@firm.com',
    deals: 3, avatar: 'LW', status: 'away', workload: 70,
    dealsList: ['Series B — Acme Corp', 'Asset Purchase — NovaTech', 'IP License — Meridian Labs'],
    joined: 'May 2024',
  },
]

const ROLE_COLORS = {
  Partner: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)', border: 'rgba(99,102,241,0.2)' },
  'Senior Associate': { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)', border: 'rgba(34,197,94,0.2)' },
  Associate: { bg: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)', border: 'rgba(245,158,11,0.2)' },
  Paralegal: { bg: 'rgba(6,182,212,0.1)', color: 'var(--color-cyan)', border: 'rgba(6,182,212,0.2)' },
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #a855f7)',
  'linear-gradient(135deg, #22c55e, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #6366f1, #06b6d4)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
]

function WorkloadBar({ value }) {
  const color = value >= 80 ? 'var(--color-danger)' : value >= 60 ? 'var(--color-warning)' : 'var(--color-success)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, width: 30 }}>{value}%</span>
    </div>
  )
}

WorkloadBar.propTypes = { value: PropTypes.number.isRequired }

function InviteModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Associate')
  const [sent, setSent] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
    }} onClick={onClose}>
      <div
        className="card fade-in"
        style={{ width: 400, padding: 28 }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Invite team member"
      >
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Invite Team Member</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Send an invite to add a colleague to your Compass workspace.
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>Invitation sent!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="settings-input"
                placeholder="colleague@firm.com"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Role
              </label>
              <select value={role} onChange={e => setRole(e.target.value)} className="settings-input">
                <option>Partner</option>
                <option>Senior Associate</option>
                <option>Associate</option>
                <option>Paralegal</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Send Invite</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

InviteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)

  const avgWorkload = Math.round(MEMBERS.reduce((s, m) => s + m.workload, 0) / MEMBERS.length)
  const activeCount = MEMBERS.filter(m => m.status === 'active').length

  return (
    <div className="fade-in">
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div className="page-header">
        <h1 className="page-title">Team</h1>
        <p className="page-subtitle">Manage team members and their deal assignments</p>
      </div>

      {/* Team stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Members', value: MEMBERS.length, color: 'var(--color-accent)' },
          { label: 'Active Now', value: activeCount, color: 'var(--color-success)' },
          { label: 'Avg Workload', value: `${avgWorkload}%`, color: avgWorkload > 75 ? 'var(--color-danger)' : 'var(--color-warning)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, letterSpacing: '-0.03em', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowInvite(true)}>
          + Invite Member
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MEMBERS.map((member, idx) => {
          const roleStyle = ROLE_COLORS[member.role] || { bg: 'rgba(99,102,241,0.08)', color: 'var(--color-text-muted)', border: 'var(--color-border)' }
          return (
            <div key={member.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                  flexShrink: 0, position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  {member.avatar}
                  <span style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 12, height: 12, borderRadius: '50%',
                    background: member.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                    border: '2px solid var(--color-surface)',
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}`,
                    }}>
                      {member.role}
                    </span>
                    <span style={{
                      fontSize: 11, padding: '2px 7px', borderRadius: 20,
                      background: member.status === 'active' ? 'var(--color-success-soft)' : 'var(--color-warning-soft)',
                      color: member.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                      marginLeft: 'auto',
                    }}>
                      {member.status === 'active' ? '● Online' : '○ Away'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>{member.email}</p>

                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        Workload
                      </div>
                      <WorkloadBar value={member.workload} />
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                        {member.deals} deal{member.deals !== 1 ? 's' : ''}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Since {member.joined}</p>
                    </div>
                  </div>

                  {member.dealsList.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {member.dealsList.map(d => (
                        <span key={d} style={{
                          fontSize: 11, padding: '2px 9px', borderRadius: 20,
                          background: 'var(--color-accent-soft)',
                          color: 'var(--color-accent-hover)',
                          border: '1px solid rgba(99,102,241,0.15)',
                        }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 24, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Pending Invitations</h3>
        <div className="empty-state" style={{ padding: '20px 0' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>✉</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No pending invitations</div>
        </div>
      </div>
    </div>
  )
}

