export interface ICreateTournament {
    name: string
    slug: string
    description?: string
    startDate: DateTime
    endDate?: DateTime
    stageType: 'SINGLE_STAGE' | 'DOUBLE_STAGE'
    playoffType: 'SINGLE_ELIM' | 'DOUBLE_ELIM'
}

export type IUpdateTournament = Partial<Omit<ICreateTournament, 'slug'>>

export interface IUpdateSetting {
    defaultBestOf?: number
    groupBestOf?: number
    upperBestOf?: number
    lowerBestOf?: number
    grandFinalBO?: number
}
