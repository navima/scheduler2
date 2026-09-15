import { backendUrl } from "../app"

export function CreateRoom() {
  return <>
    <div>
      Create room
      <form onSubmit={async (e) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        let roomName = formData.get('roomName')
        if (roomName == '')
          roomName = null

        const response = await fetch(`${backendUrl}/api/room`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: roomName})
        })

        if (response.ok) {
          const roomData = await response.json()
          window.location.href = `/${roomData.id}`
        } else {
          console.error(`Failed to create room: ${response.status} ${response.statusText}`)
        }
      }}>
        <input type="text" name="roomName" placeholder="Room name" />
        <button type="submit">Create</button>
      </form>
    </div>
  </>
}