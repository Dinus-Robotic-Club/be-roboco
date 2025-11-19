export interface IReqBodyCreateTeam {
    team: ICreateTeam
    participants: ICreateParticipant[]
    invoice: string
}

export type IUpdateTeam = Partial<Omit<ICreateTeam, 'password' | 'category' | 'email'>>
export type IUpdateParticipant = Partial<Omit<ICreateParticipant, 'twibbon' | 'identityCardImage'>>

export enum CompetitionCategory {
    SOCCER = 'SOCCER',
    SUMO = 'SUMO',
}

export enum RoleParticipant {
    LEADER = 'LEADER',
    MEMBER = 'MEMBER',
}

export enum RegistrationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

export interface ICreateTeam {
    name: string
    school: string
    password: string
    email: string
    logo?: string
    category: CompetitionCategory
}

export interface ICreateParticipant {
    name: string
    image: string
    identityCardImage: string
    roleInTeam: RoleParticipant
    phone: string
    twibbon: string
}

export interface ICreateRegistration {
    teamId: string
    qrToken: string
    qrUrl: string
    status: RegistrationStatus
    registeredAt: DateTime
}

export interface IResponseTeams {
    uid: string
    groupId: string
    teamId: string
    team: IResponseTeamOnTeams
}

export interface IResponseTeamOnTeams {
    uid: string
    name: string
    email: string
    logo: string
    school: string
    category: CompetitionCategory
}
