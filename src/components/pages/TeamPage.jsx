const MEMBERS = [
  { id: 1, name: 'Sarah Chen', role: 'Partner', email: 'sarah.chen@firm.com', deals: 2, avatar: 'SC', status: 'active' },
  { id: 2, name: 'Marcus Liu', role: 'Senior Associate', email: 'marcus.liu@firm.com', deals: 1, avatar: 'ML', status: 'active' },
  { id: 3, name: 'Priya Nair', role: 'Associate', email: 'priya.nair@firm.com', deals: 1, avatar: 'PN', status: 'active' },
  { id: 4, name: 'James Okafor', role: 'Partner', email: 'james.okafor@firm.com', deals: 1, avatar: 'JO', status: 'active' },
  { id: 5, name: 'Lin Wei', role: 'Paralegal', email: 'lin.wei@firm.com', deals: 3, avatar: 'LW', status: 'away' },
]

const ROLE_COLORS = {
  Partner: { bg: 'rgba(99,102,241,0.12)', color: 'var(--color-accent)' },
  'Senior Associate': { bg: 'rgba(34,197,94,0.12)', color: 'var(--color-success)' },
  Associate: { bg: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)' },
  Paralegal: { bg: 'rgba(99,102,241,0.08)', color: 'var(--color-text-muted)' },
}

export default function TeamPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Team</h1>
        <p className="page-subtitle">Manage team members and their deal assignments</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button type="button" className="btn btn-primary">+ Invite Member</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MEMBERS.map(member => {
          const roleStyle = ROLE_COLORS[member.role] || { bg: 'rgba(99,102,241,0.08)', color: 'var(--color-text-muted)' }
          return (
            <div key={member.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--color-accent)',
                  flexShrink: 0, position: 'relative',
                }}>
                  {member.avatar}
                  <span style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 10, height: 10, borderRadius: '50%',
                    background: member.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                    border: '2px solid var(--color-surface)',
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 5,
                      background: roleStyle.bg, color: roleStyle.color,
                    }}>
                      {member.role}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{member.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{member.deals} deal{member.deals !== 1 ? 's' : ''}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>assigned</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 32, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Pending Invitations</h3>
        <div style={{
          padding: 20, textAlign: 'center',
          border: '1px dashed var(--color-border)', borderRadius: 10,
        }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No pending invitations</p>
        </div>
      </div>
    </div>
  )
}
