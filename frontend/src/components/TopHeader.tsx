export function TopHeader({ username, handleLogout }: { username: string | undefined | null, handleLogout: () => void }) {
    return <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>{username}</div>
        {username && <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
          Logout
        </a>}
      </div>
    </>
}