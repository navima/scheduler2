import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { CreateRoom } from './components/CreateRoom'
import { type RoomData } from './model';
import { SchedulePanel } from './components/SchedulePanel';
import { TopHeader } from './components/TopHeader';


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
  const roomName = roomData.name ?? "Room " + roomId

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

  const handleLogout = () => {
    localStorage.removeItem('username')
    setUsername(null)
  }

  if (!roomFound) {
    if (error) {
      return <>
        <TopHeader username={username} handleLogout={handleLogout} />
        <CreateRoom />
      </>
    }
    return <div>Loading...</div>
  }

  if (!username) {
    return (<>
      <TopHeader username={username} roomName={roomName} handleLogout={handleLogout} />
      <div style={{ padding: '20px' }}>
        <h2>Enter your username</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const usernameInput = formData.get('username') as string;
          if (usernameInput.trim()) {
            localStorage.setItem('username', usernameInput.trim())
            setUsername(usernameInput.trim())
          }
        }}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            style={{ padding: '8px', marginRight: '8px' }}
          />
          <button type='submit' style={{ padding: '8px 16px' }}>
            Set Username
          </button>
        </form>
      </div>
    </>)
  }

  if ((roomData as RoomData).userData.find(ud => ud.username === username) === undefined)
    (roomData as RoomData).userData.push({ username: username || 'Guest', days: [] })

  return (
    <>
      <TopHeader username={username} roomName={roomName} handleLogout={handleLogout} />
      <SchedulePanel roomId={roomId} data={roomData} username={username} />
    </>
  );
}
