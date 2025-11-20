import { prisma } from './../config/prisma'
import { ICreateTournament, IUpdateSetting, IUpdateTournament } from '../utils/types/tour'
import { emitToTournament, io } from './socket.service'

export const createTournamentService = async (data: ICreateTournament, image: string) => {
    const existTournament = await prisma.tournament.findUnique({
        where: {
            slug: data.slug,
        },
    })

    if (existTournament) throw new Error('Tournament already exist')

    return await prisma.$transaction(async (tx) => {
        const turnament = await tx.tournament.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description ? data.description : null,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                stageType: data.stageType,
                image: image,
                location: data.location,
                playoffType: data?.playoffType,
            },
        })

        await tx.setting.create({
            data: {
                tournamentId: turnament.uid,
                defaultBestOf: 3,
                groupBestOf: 3,
                upperBestOf: 3,
                lowerBestOf: 3,
                grandFinalBestOf: 3,
            },
        })

        io!.emit('tournament:created', turnament)
        return turnament
    })
}

export const updateTournamentService = async (data: IUpdateTournament, tourId: string, image: string) => {
    const updatedData = await prisma.tournament.update({
        where: {
            uid: tourId,
        },
        data: {
            ...data,
            image: image,
        },
    })
    emitToTournament(tourId, 'tournament:update', updatedData)
    return updatedData
}

export const getAllTournamentService = async () => {
    return await prisma.tournament.findMany({
        select: {
            uid: true,
            name: true,
            startDate: true,
            endDate: true,
            location: true,
            image: true,
            slug: true,
        },
    })
}

export const getDetailTournamentBySlugService = async (slug: string) => {
    return await prisma.tournament.findUnique({
        where: {
            slug: slug,
        },
        select: {
            uid: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            image: true,
            registrations: {
                select: {
                    uid: true,
                    status: true,
                    team: {
                        select: {
                            uid: true,
                            name: true,
                            logo: true,
                        },
                    },
                },
            },
            groups: {
                select: {
                    uid: true,
                    name: true,
                    teams: {
                        select: {
                            team: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
            settings: true,
            brackets: true,
            matches: true,
        },
    })
}

export const deleteTournamentService = async (tourId: string) => {
    const deleteData = await prisma.tournament.delete({
        where: {
            uid: tourId,
        },
    })
    emitToTournament(tourId, 'tournament:delete', deleteData)
    return deleteData
}

export const updateSettingService = async (tourId: string, data: IUpdateSetting) => {
    const updateSetting = await prisma.setting.update({
        where: {
            tournamentId: tourId,
        },
        data: {
            ...data,
        },
    })
    emitToTournament(tourId, 'setting:update', updateSetting)
    return updateSetting
}
