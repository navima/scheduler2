export const Status = {
  unknown: 'unknown',
  no: 'no',
  maybe: 'maybe',
  yes: 'yes'
} as const

export type Status = typeof Status[keyof typeof Status]

export type UserDayRange = {
  date: string
  status: Status
  note: string | undefined
  modified: boolean | undefined
}

export type UserData = {
  username: string
  days: UserDayRange[]
}

export type RoomData = {
  userData: UserData[]
  name: string | undefined
  id: string
}