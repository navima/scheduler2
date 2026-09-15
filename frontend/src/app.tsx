import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { CreateRoom } from './components/CreateRoom'
import { type RoomData } from './model';
import { SchedulePanel } from './components/SchedulePanel';


// Use current host and protocol for API calls, falling back to env variable for development
const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  // If environment URL is set, use it
  if (envUrl && envUrl.trim()) {
    return envUrl;
  }
  // Otherwise, use the same host and protocol as the frontend
  const protocol = window.location.protocol.replace(':', '');
  const host = window.location.host; // includes port if specified
  return `${protocol}://${host}`;
};

export const backendUrl = getBackendUrl();

export function App() {
  const [error, setError] = useState<{ text: string, code: number } | null>(null)
  const [roomData, setRoomData] = useState<RoomData>({ userData: [], name: undefined, id: '' })
  const roomId = window.location.pathname.slice(1)

  // app state
  const [roomFound, setRoomFound] = useState(false)
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'))

  useEffect(() => {
    fetch(`${backendUrl}/api/room/${roomId}`)
      .then(res => {
        if (res.ok) {
          return res.json()
            .then(data => {
              console.log('Fetched room data:', data)
              setRoomData(data)
              setRoomFound(true)
            })
        } else {
          setError({ text: res.statusText, code: res.status })
        }
      })
  }, [])

  if (!roomFound) {
    if (error) {
      return <>
        <div>{error.code} {error.text}</div>
        <CreateRoom />
      </>
    }
    return <div>Loading...</div>
  }

  const [inputUsername, setInputUsername] = useState('')

  const handleSetUsername = () => {
    if (inputUsername.trim()) {
      localStorage.setItem('username', inputUsername.trim())
      setUsername(inputUsername.trim())
      setInputUsername('')
    }
  }

  if (!username) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>{roomData.name ?? "Room " + roomId}</h2>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
          Leave room
        </a>
        <h2>Enter your username</h2>
        <input
          type="text"
          value={inputUsername}
          onInput={(e) => setInputUsername((e.target as HTMLInputElement).value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
          placeholder="Username"
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={handleSetUsername} style={{ padding: '8px 16px' }}>
          Set Username
        </button>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    setUsername(null)
  }

  if ((roomData as RoomData).userData.find(ud => ud.username === username) === undefined)
    (roomData as RoomData).userData.push({ username: username || 'Guest', days: [] })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>Username: {username}</div>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
          Logout
        </a>
      </div>
      <SchedulePanel roomId={roomId} data={roomData} username={username} />
    </>
  );
}
