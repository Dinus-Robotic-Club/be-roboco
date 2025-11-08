import { prisma } from '../config/prisma'
import { ICreatedGroups } from '../utils/types/group'
import { emitToTournament } from './socket.service'

export const createGroupService = async (tourId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        const registrations = await tx.registration.findMany({
            where: { tournamentId: tourId, status: 'APPROVED' },
            include: { team: true },
            orderBy: { registeredAt: 'desc' },
        })

        if (!registrations.length) throw new Error('No teams approved')

        const teams = registrations.map((r) => r.team)
        const totalTeams = teams.length
        const groupSize = 4
        const groupCount = Math.floor(totalTeams / groupSize)
        const remainder = totalTeams % groupSize

        const createdGroups: ICreatedGroups[] = []
        for (let i = 0; i < groupCount; i++) {
            const g = await tx.group.create({
                data: {
                    tournamentId: tourId,
                    name: `Group ${String.fromCharCode(65 + i)}`,
                },
            })
            createdGroups.push(g)
        }

        let index = 0
        for (let i = 0; i < groupCount; i++) {
            const slice = teams.slice(index, index + groupSize)
            index += groupSize

            await tx.groupTeam.createMany({
                data: slice.map((t) => ({
                    groupId: createdGroups[i].uid,
                    teamId: t.uid,
                })),
            })
        }

        if (remainder > 0) {
            const leftoverTeams = teams.slice(groupCount * groupSize)

            for (let i = 0; i < leftoverTeams.length; i++) {
                const targetGroup = createdGroups[i % createdGroups.length]
                await tx.groupTeam.create({
                    data: { groupId: targetGroup.uid, teamId: leftoverTeams[i].uid },
                })
            }
        }

        const groupWithMembers = await tx.group.findMany({
            where: { tournamentId: tourId },
            include: {
                teams: {
                    include: {
                        team: {
                            select: {
                                uid: true,
                                name: true,
                                email: true,
                                logo: true,
                                school: true,
                                category: true,
                            },
                        },
                    },
                },
            },
        })

        return groupWithMembers
    })

    emitToTournament(tourId, 'groups:generate', result)
    return result
}
