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
  id: string
  date: string
  dateEnd: string | undefined
  status: Status
  note: string
}

type UserData = {
  username: string
  days: UserDayRange[]
}

type RoomData = {
  userData: UserData[]
}

const backendUrl = 'localhost:8080'

function StatusCell({ userDay, dateStr, showNoteIcon }: { userDay: UserDayRange | undefined, dateStr: string, showNoteIcon: boolean }) {
  return (
    <td title={userDay?.note || ''} class={`status-${userDay?.status || 'unknown'}`}>
      {showNoteIcon && userDay?.note && <span class="note-mark"></span>}
    </td>
  )
}

function getUserDayForDate(user: UserData, dateStr: string): UserDayRange | undefined {
  return user.days.find(d => {
    const dayDate = new Date(d.date).toISOString().split('T')[0]
    const dayEndDate = d.dateEnd ? new Date(d.dateEnd).toISOString().split('T')[0] : dayDate
    return dayDate <= dateStr && dateStr <= dayEndDate
  })
}

function MainPanel({ room, data, username }: { room: string, username: string, data: RoomData }) {
  const today = new Date().toISOString().split('T')[0]
  const defaultMaxDay = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const maxDay = data.userData.flatMap(ud => ud.days.map(d => d.dateEnd ?? d.date)).reduce((a, b) => a > b ? a : b, defaultMaxDay) ?? defaultMaxDay;
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
      Username: {username} Room: {room}
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

            return (
              <tr key={user.username}>
                <td>{user.username}</td>
                {cells.map(({ index, dateStr, userDay }) => (
                  <StatusCell key={dateStr} userDay={userDay} dateStr={dateStr} showNoteIcon={index === lastNoteIndex} />
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
  const username = 'guest_' + Math.floor(Math.random() * 1000)
  const room = window.location.pathname.slice(1)
  const [data, setData] = useState<RoomData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://${backendUrl}/room/${room}`)
      .then(response => response.json())
      .then(setData)
      .catch(error => {
        setError('Error fetching room data:' + error)
      })
  }, [room])

  if (data) {
    return <MainPanel room={room} data={data} username={username} />;
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div>Loading...</div>
}
