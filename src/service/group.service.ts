import { prisma } from '../config/prisma'
import { ICreatedGroups } from '../utils/types/group'
import { emitToTournament } from './socket.service'

export const createGroupService = async (tourId: string) => {
    const existTour = await prisma.tournament.findUnique({
        where: {
            uid: tourId,
        },
    })

    if (!existTour) throw new Error('Tournament not found')
    const groupSize = 4

    const result = await prisma.$transaction(async (tx) => {
        const registrations = await tx.registration.findMany({
            where: { tournamentId: tourId, status: 'APPROVED' },
            include: { team: true },
            orderBy: { registeredAt: 'desc' },
        })

        if (!registrations.length) throw new Error('No approved teams found')

        const teamsByCategory = registrations.reduce<Record<string, any[]>>((acc, r) => {
            const category = r.team.category
            if (!acc[category]) acc[category] = []
            acc[category].push(r.team)
            return acc
        }, {})

        const createdGroups: ICreatedGroups[] = []

        for (const [category, teams] of Object.entries(teamsByCategory)) {
            const totalTeams = teams.length
            const groupCount = Math.floor(totalTeams / groupSize)
            const remainder = totalTeams % groupSize

            if (totalTeams === 0) continue

            console.log(`Creating groups for ${category}: ${totalTeams} teams`)

            const newGroups = await Promise.all(
                Array.from({ length: groupCount }, (_, i) =>
                    tx.group.create({
                        data: {
                            tournamentId: tourId,
                            name: `${category}-Group ${String.fromCharCode(65 + i)}`,
                        },
                    }),
                ),
            )

            createdGroups.push(...newGroups)

            let index = 0
            for (let i = 0; i < groupCount; i++) {
                const slice = teams.slice(index, index + groupSize)
                index += groupSize

                await tx.groupTeam.createMany({
                    data: slice.map((t) => ({
                        groupId: newGroups[i].uid,
                        teamId: t.uid,
                    })),
                })
            }

            if (remainder > 0) {
                const leftoverTeams = teams.slice(groupCount * groupSize)
                for (let i = 0; i < leftoverTeams.length; i++) {
                    const targetGroup = newGroups[i % newGroups.length]
                    console.log(targetGroup)

                    await tx.groupTeam.create({
                        data: {
                            groupId: targetGroup.uid,
                            teamId: leftoverTeams[i].uid,
                        },
                    })
                }
            }
        }

        const groupWithTeams = await tx.group.findMany({
            where: { tournamentId: tourId },
            include: {
                teams: {
                    include: {
                        team: {
                            select: {
                                uid: true,
                                name: true,
                                logo: true,
                                school: true,
                                category: true,
                            },
                        },
                    },
                },
            },
        })

        return groupWithTeams
    })

    emitToTournament(tourId, 'groups:generate', result)
    return result
}

export const getAllGroupsService = async (tourId: string) => {
    return await prisma.group.findMany({
        where: {
            tournamentId: tourId,
        },
        include: {
            teams: {
                include: {
                    team: true,
                },
            },
        },
    })
}
