import logo from '../assets/logo.svg';

export function TopHeader({ username, handleLogout, roomName }: { username?: string | undefined | null, handleLogout: () => void, roomName?: string | null | undefined }) {
    return <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <a href={"/"}>
                    <img src={logo} width={32} />
                </a>
                <div style={{ width: '16px' }}></div>
                <div>{username}</div>
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                {roomName && <>
                    <div style={{ fontSize: 'x-large' }}>{roomName}</div>
                </>}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                {username && <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
                    Logout
                </a>}
            </span>
        </div>
    </>
}