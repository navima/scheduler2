import { useEffect, useState } from 'preact/hooks'
import './app.css'

const Status = {
  unknown: 'unknown',
  no: 'no',
  maybe: 'maybe',
  yes: 'yes'
} as const

type Status = typeof Status[keyof typeof Status]

type UserDayRange = {
  date: string
  status: Status
  note: string | undefined
}

type UserData = {
  username: string
  days: UserDayRange[]
}

type RoomData = {
  userData: UserData[]
}

const backendUrl = 'localhost:8080'

function StatusCell({ userDay, showNoteIcon, date }: { userDay: UserDayRange | undefined, showNoteIcon: boolean, date: Date }) {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const cellClass = `status-${userDay?.status || 'unknown'}${isWeekend ? ' weekend' : ''}`
  return (
    <td title={userDay?.note || ''} class={cellClass}>
      {showNoteIcon && userDay?.note && <span class="note-mark"></span>}
    </td>
  )
}

function getUserDayForDate(user: UserData, dateStr: string): UserDayRange | undefined {
  return user.days.find(d => {
    const dayDate = new Date(d.date).toISOString().split('T')[0]
    return dayDate == dateStr
  })
}

function MainPanel({ room, data, username }: { room: string, username: string, data: RoomData }) {
  const today = new Date().toISOString().split('T')[0]
  const defaultMaxDay = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const maxDay = data.userData.flatMap(ud => ud.days.map(d => d.date)).reduce((a, b) => a > b ? a : b, defaultMaxDay) ?? defaultMaxDay;
  console.log('Today:', today, 'MaxDay:', maxDay);

  // Generate date headers and group by month
  const dateHeaders: Date[] = []
  const monthGroups = new Map<string, Date[]>()
  const startDate = new Date(today)
  const endDate = new Date(maxDay)

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateCopy = new Date(d)
    dateHeaders.push(dateCopy)

    const monthKey = dateCopy.toISOString().slice(0, 7)
    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, [])
    }
    monthGroups.get(monthKey)!.push(dateCopy)
  }

  return <>
    <div>
      Room: {room}
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th rowSpan={3}>Username</th>
            {Array.from(monthGroups.entries()).map(([month, dates]) => (
              <th key={month} colSpan={dates.length}>
                {month}
              </th>
            ))}
          </tr>
          <tr>
            {dateHeaders.map(date => (
              <th key={date.toISOString().split('T')[0]}>
                {date.getDate()}
              </th>
            ))}
          </tr>
          <tr>
            {dateHeaders.map(date => (
              <th key={date.toISOString().split('T')[0]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.userData.map(user => {
            const cells = dateHeaders.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0]
              const userDay = getUserDayForDate(user, dateStr)
              return { index, dateStr, userDay }
            })

            const lastNoteIndex = cells
              .reduce((last, c, i) => c.userDay?.note ? i : last, -1)

            const isCurrentUser = user.username === username
            return (
              <tr key={user.username} class={isCurrentUser ? 'current-user-row' : ''}>
                <td>{user.username}</td>
                {cells.map(({ index, dateStr, userDay }, cellIndex) => (
                  <StatusCell key={dateStr} userDay={userDay} showNoteIcon={index === lastNoteIndex} date={dateHeaders[cellIndex]} />
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </>;
}

export function App() {
  const [error, setError] = useState<{ text: string, code: number } | null>(null)
  const [data, setData] = useState<RoomData>({ userData: [] })
  const room = window.location.pathname.slice(1)

  // app state
  const [roomFound, setRoomFound] = useState(false)
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'))

  useEffect(() => {
    fetch(`http://${backendUrl}/room/${room}`)
      .then(res => {
        if (res.ok) {
          return res.json()
            .then(data => {
              console.log('Fetched room data:', data)
              setData(data)
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
        <div>
          Create room
          <button onClick={() => {
            fetch(`http://${backendUrl}/room`, {
              method: 'POST'
            }).then(response => {
              if (response.ok) {
                return response.json()
                  .then(room => {
                    window.location.href = `/${room}`
                  })
              } else {
                setError({ text: response.statusText, code: response.status })
              }
            })
          }}>Create</button>
        </div>
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
        <h2>Room {room}</h2>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
          Reload Room
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

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>Username: {username}</div>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#1976d2', cursor: 'pointer' }}>
          Logout
        </a>
      </div>
      <MainPanel room={room} data={data} username={username} />
    </>
  );
}
