import { IResponseTeams } from './team'

export interface ICreatedGroups {
    name: string
    uid: string
    createdAt: Date
    tournamentId: string
}

export interface IResponseDataGroups {
    uid: string
    tournamentId: string
    name: string
    round: number
    teams: IResponseTeams[]
}
