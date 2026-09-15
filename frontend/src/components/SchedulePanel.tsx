import { useEffect, useState } from "preact/hooks";
import { backendUrl } from "../app";
import { type UserDayRange, type UserData, Status, type RoomData } from "../model";


function StatusCell({ userDay, showNoteIcon, date, selectable, onSelect, selected }: { userDay: UserDayRange | undefined, showNoteIcon: boolean, date: Date, selectable?: boolean, onSelect?: (userDay: UserDayRange) => void, selected?: boolean }) {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const cellClass = `timeslot status-${userDay?.status || 'unknown'} ${isWeekend ? ' weekend' : ''} ${selectable ? 'selectable' : ''} ${selected ? ' selected' : ''}`
  return (
    <td title={userDay?.note || ''} class={cellClass} onClick={() => {
      if (selectable && userDay) {
        onSelect?.(userDay)
      }
    }}>
      {showNoteIcon && userDay?.note && <span class="note-mark"></span>}
    </td>
  )
}

function getUserDayForDate(user: UserData, dateStr: string): UserDayRange | undefined {
  return user.days.find(d => {
    const dayDate = new Date(d.date).toISOString().split('T')[0]
    return dayDate == dateStr
  }) ?? { date: dateStr, status: Status.unknown, note: undefined, modified: false }
}

type StatusPickerProps =
  | { showEmpty?: false, status: Status, onStatusChange: (newStatus: Status) => void }
  | { showEmpty: true, status: Status | undefined, onStatusChange: (newStatus: Status | undefined) => void }
function StatusPicker({ status, onStatusChange, showEmpty }: StatusPickerProps) {
  return <>
    <span class={'status-picker'}>
      <button class={`option yes ${status === 'yes' ? 'selected' : ''}`} onClick={() => onStatusChange(Status.yes)}>&nbsp;</button>
      <button class={`option maybe ${status === 'maybe' ? 'selected' : ''}`} onClick={() => onStatusChange(Status.maybe)}>&nbsp;</button>
      <button class={`option no ${status === 'no' ? 'selected' : ''}`} onClick={() => onStatusChange(Status.no)}>&nbsp;</button>
      <button class={`option unknown ${status === 'unknown' ? 'selected' : ''}`} onClick={() => onStatusChange(Status.unknown)}>&nbsp;</button>
      {showEmpty && <button class={`option clear ${status === undefined ? 'selected' : ''}`} onClick={() => onStatusChange(undefined)}>×</button>}
    </span>
  </>
}

export function SchedulePanel({ roomId, data: initialData, username }: { roomId: string, username: string, data: RoomData }) {
  const today = new Date().toISOString().split('T')[0]
  const defaultMaxDay = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const maxDay = initialData.userData.flatMap(ud => ud.days.map(d => d.date)).reduce((a, b) => a > b ? a : b, defaultMaxDay) ?? defaultMaxDay;
  console.log('Today:', today, 'MaxDay:', maxDay);

  const [selectedCell, setSelectedCell] = useState<UserDayRange | undefined>(undefined)
  const [data, setData] = useState<RoomData>(initialData)
  const [paintingStatus, setPaintingStatus] = useState<Status | undefined>(undefined)

  // Save
  useEffect(() => {
    const timer = setTimeout(() => {
      const modified = data.userData.find(ud => ud.username === username)?.days.filter(d => d.modified) || []
      if (modified.length > 0) {
        console.log('Saving modified data:', modified)
        fetch(`${backendUrl}/api/room/${roomId}/user/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(modified.map(d => ({ date: d.date, status: d.status, note: d.note })))
        }).then(res => {
          if (res.ok) {
            // Clear modified flags
            data.userData.filter(ud => ud.username === username).forEach(user => {
              user.days.forEach(d => {
                d.modified = false
              })
            })
            setData({ ...data })
            console.log('Save successful')
          } else {
            console.error('Save failed:', res.statusText)
          }
        })
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [data])

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

  function onCellSelectHandler(userDay: UserDayRange) {
    console.log('Cell selected:', userDay)
    if (paintingStatus !== undefined) {
      userDay.status = paintingStatus
      userDay.modified = true
      data.userData.filter(ud => ud.username === username).forEach(user => {
        const day = user.days.find(d => d.date === userDay.date)
        if (day) {
          day.status = paintingStatus!
          day.modified = true
        } else {
          user.days.push({ ...userDay })
        }
      })
      setData({ ...data })
    }
    else {
      setSelectedCell(userDay)
    }
  }

  function onSelectedCellStatusChangeHandler(newStatus: Status) {
    if (selectedCell) {
      console.log('Selected cell status change:', selectedCell, '->', newStatus)
      selectedCell.status = newStatus
      selectedCell.modified = true
      data.userData.filter(ud => ud.username === username).forEach(user => {
        const day = user.days.find(d => d.date === selectedCell.date)
        if (day) {
          day.status = newStatus
          day.modified = true
        } else {
          user.days.push({ ...selectedCell })
        }
      })
      setData({ ...data })
      setSelectedCell({ ...selectedCell })
    }
  }

  function onSelectedCellNoteChangeHandler(newNote: string) {
    if (selectedCell) {
      console.log('Selected cell note change:', selectedCell, '->', newNote)
      selectedCell.note = newNote
      selectedCell.modified = true
      data.userData.filter(ud => ud.username === username).forEach(user => {
        const day = user.days.find(d => d.date === selectedCell.date)
        if (day) {
          day.note = newNote
          day.modified = true
        } else {
          user.days.push({ ...selectedCell })
        }
      })
      setData({ ...data })
      setSelectedCell({ ...selectedCell })
    }
  }

  function onPaintingStatusChangeHandler(newStatus?: Status) {
    setPaintingStatus(newStatus)
    if (newStatus !== undefined) {
      setSelectedCell(undefined)
    }
  }

  return <>
    <div style={{overflowX: 'scroll'}}>
      <table>
        <thead>
          <tr>
            <th rowSpan={3}></th>
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
                  <StatusCell selectable={isCurrentUser} key={dateStr} userDay={userDay} showNoteIcon={index === lastNoteIndex} date={dateHeaders[cellIndex]} onSelect={onCellSelectHandler} selected={isCurrentUser && selectedCell?.date === dateStr} />
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    <div>
      Painting
      <StatusPicker status={paintingStatus} onStatusChange={onPaintingStatusChangeHandler} showEmpty={true} />
    </div>
    {selectedCell && <div>
      Selected
      <div>
        Date: {selectedCell.date}

        <div>Status: <StatusPicker status={selectedCell.status} onStatusChange={onSelectedCellStatusChangeHandler} /></div>
        <div>Note: <input type='text' value={selectedCell.note} onInput={e => onSelectedCellNoteChangeHandler(e.currentTarget.value)} /></div>
      </div>
    </div>}
  </>;
}