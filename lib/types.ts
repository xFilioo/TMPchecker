export interface User {
  id: number
  name: string
  avatar: string
  smallAvatar: string
  joinDate: string
  steamID64: string
  steamID: string
  discordSnowflake?: string
  displayVTCHistory: boolean
  groupName: string
  groupColor: string
  groupID: number
  banned: boolean
  bannedUntil: string | null
  bansCount: number
  displayBans: boolean
  patreon: {
    isPatron: boolean
    active: boolean
    color: string
    tierId: number
    currentPledge: number
    lifetimePledge: number
    nextPledge: number
    hidden: boolean
  }
  permissions: {
    isStaff: boolean
    isUpperStaff: boolean
    isGameAdmin: boolean
    showDetailedOnWebMaps: boolean
  }
  vtc: {
    id: number
    name: string
    tag: string
    inVTC: boolean
    memberID: number
  } | null
  vtcHistory?: any[]
  achievements?: any[]
  awards?: any[]
  bans?: Ban[]
  events?: Event[]
}

export interface Ban {
  expiration: string | null
  timeAdded: string
  active: boolean
  reason: string
  adminName: string
  adminID: number
}

export interface Server {
  id: number
  game: string
  ip: string
  port: number
  name: string
  shortname: string
  idprefix?: string
  online: boolean
  players: number
  queue: number
  maxplayers: number
  mapid: number
  displayorder: number
  speedlimiter: number
  collisions: boolean
  carsforplayers: boolean
  policecarsforplayers: boolean
  afkenabled: boolean
  event: boolean
  specialEvent: boolean
  promods: boolean
  syncdelay: number
}

export interface Event {
  id: number
  event_type: {
    key: string
    name: string
  }
  name: string
  slug: string
  game: string
  server: {
    id: number
    name: string
  }
  language: string
  departure: {
    location: string
    city: string
  }
  arrive: {
    location: string
    city: string
  }
  meetup_at: string
  start_at: string
  banner: string
  map: string
  description: string
  rule: string
  voice_link: string
  external_link: string
  featured: string
  vtc: {
    id: number
    name: string
  } | null
  user: {
    id: number
    username: string
  }
  attendances: {
    confirmed: number
    unsure: number
    vtcs: number
  }
  dlcs: Record<string, string>
  url: string
  created_at: string
  updated_at: string
}

export interface EventsResponse {
  featured: Event[]
  today: Event[]
  now: Event[]
  upcoming: Event[]
}

export interface ApiResponse<T> {
  error: boolean
  response: T
  descriptor?: string
}

export interface GameTime {
  error: boolean
  game_time: number
  unix_timestamp?: number
}
