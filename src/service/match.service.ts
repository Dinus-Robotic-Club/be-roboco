import { prisma } from '../config/prisma'
import { emitToTournament } from './socket.service'

export const createMatchGroup = async (tourId: string) => {
    const data = await prisma.$transaction(
        async (tx) => {
            const tur = await tx.tournament.findUnique({
                where: {
                    uid: tourId,
                },
                include: {
                    settings: true,
                },
            })

            if (!tur) throw new Error('Tournament not found!')

            const groups = await tx.group.findMany({
                where: {
                    tournamentId: tur?.uid,
                },
            })

            if (groups.length === 0) throw new Error('Groups not found')
            const bestOf = tur.settings?.groupBestOf
            const matches = []

            for (const group of groups) {
                const teams = await tx.groupTeam.findMany({
                    where: { groupId: group.uid },
                    include: { team: true },
                    orderBy: { uid: 'asc' },
                })

                console.log(teams.length)

                for (let i = 0; i < teams.length; i++) {
                    for (let j = i + 1; j < teams.length; j++) {
                        matches.push(
                            tx.match.create({
                                data: {
                                    tournamentId: tur.uid,
                                    groupId: group.uid,
                                    teamAId: teams[i].team.uid,
                                    teamBId: teams[j].team.uid,
                                    bestOf,
                                    status: 'SCHEDULED',
                                    roundLabel: `match ${teams[i].team.name} vs ${teams[j].team.name}`,
                                },
                            }),
                        )
                    }
                }
            }
            return await Promise.all(matches)
        },
        {
            timeout: 20000,
            maxWait: 5000,
        },
    )
    emitToTournament(tourId, 'match-group:create', data)
    return data
}

export const getMatchGroup = async (tourId: string, type?: 'SOCCER' | 'SUMO') => {
    return prisma.group.findMany({
        where: {
            tournamentId: tourId,
            ...(type
                ? {
                      teams: {
                          some: {
                              team: {
                                  category: {
                                      equals: type,
                                  },
                              },
                          },
                      },
                  }
                : {}),
        },
        include: {
            matches: {
                include: { teamA: true, teamB: true },
            },
            teams: {
                include: {
                    team: {
                        select: {
                            uid: true,
                            name: true,
                            category: true,
                        },
                    },
                },
            },
        },
    })
}
