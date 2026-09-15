import logo from '../assets/logo.svg';

export function TopHeader({ username, handleLogout }: { username: string | undefined | null, handleLogout: () => void }) {
    return <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ display: 'flex' }}>
                <a href={"/"}>
                    <img src={logo} width={32} />
                </a>
                <div style={{width: '16px'}}></div>
                <div>{username}</div>
            </span>
            {username && <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
                Logout
            </a>}
        </div>
    </>
}