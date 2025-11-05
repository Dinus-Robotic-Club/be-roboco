export interface IReqBodyCreateTeam {
    team: ICreateTeam
    participants: ICreateParticipant[]
}

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
    twibbon: string
    invoice: string
    logo?: string
    category: CompetitionCategory
}

export interface ICreateParticipant {
    name: string
    image: string
    identityCardImage: string
    roleInTeam: RoleParticipant
}

export interface ICreateRegistration {
    teamId: string
    qrToken: string
    qrUrl: string
    status: RegistrationStatus
    registeredAt: DateTime
}
