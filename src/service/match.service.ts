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
                        console.log(`match ${teams[i].team.name} vs ${teams[j].team.name} category ${teams[i].team.category}`)

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

export const createMatchRound = async (matchId: string, tourId: string) => {
    return await prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({
            where: { uid: matchId },
            include: { rounds: true },
        })

        if (!match) throw new Error('Match not found')

        const activeRound = match.rounds.find((r) => r.status === 'ACTIVE')
        if (activeRound) {
            throw new Error('There is still an active round for this match')
        }

        const nextRoundNumber = (match.rounds.length || 0) + 1

        const ROUND_DURATION_MINUTES = await tx.setting.findFirst({
            where: {
                tournamentId: tourId,
            },
        })

        const durationMap = {
            SOCCER: ROUND_DURATION_MINUTES?.roundDurationSoccer,
            SUMO: ROUND_DURATION_MINUTES?.roundDurationSumo,
        }

        const duration = durationMap[match?.category!] ?? 5

        const newRound = await tx.matchRound.create({
            data: {
                matchId: match.uid,
                roundNumber: nextRoundNumber,
                endTime: duration.toString(),
                status: 'ACTIVE',
            },
        })

        return newRound
    })
}

export const updateScore = async (matchId: string, teamId: string, golScore: number, knockoutScore: number, time: string) => {
    const match = await prisma.match.findUnique({
        where: { uid: matchId },
        include: { rounds: true },
    })

    if (!match) throw new Error('Match not found')

    return await prisma.$transaction(async (tx) => {
        const currentRound = await tx.matchRound.findFirst({
            where: { matchId, status: 'ACTIVE' },
            orderBy: { roundNumber: 'desc' },
        })

        if (!currentRound) throw new Error('Round has been finished')

        await tx.logScore.create({
            data: {
                matchId: matchId,
                roundId: currentRound!.uid,
                teamId: teamId,
                golScore: golScore,
                time: time,
            },
        })

        const goalsA = await tx.logScore.aggregate({
            _sum: { golScore: true },
            where: {
                matchId: matchId,
                roundId: currentRound!.uid,
                teamId: match.teamAId,
            },
        })

        const goalsB = await tx.logScore.aggregate({
            _sum: { golScore: true },
            where: {
                matchId,
                roundId: currentRound!.uid,
                teamId: match.teamBId,
            },
        })

        const scoreA = goalsA._sum.golScore ?? 0
        const scoreB = goalsB._sum.golScore ?? 0

        await tx.matchRound.update({
            where: { uid: currentRound!.uid },
            data: { scoreDetail: `${scoreA}-${scoreB}` },
        })

        const totalGoalsA = await tx.matchRound.findMany({
            where: { matchId },
            select: { scoreDetail: true },
        })

        let totalA = 0
        let totalB = 0
        for (const round of totalGoalsA) {
            if (round.scoreDetail) {
                const [a, b] = round.scoreDetail.split('-').map(Number)
                totalA += a
                totalB += b
            }
        }

        let winnerId: string | null = null
        if (totalA > totalB) {
            winnerId = match.teamAId
        } else if (totalB > totalA) {
            winnerId = match.teamBId
        }

        await tx.team.update({
            where: { uid: teamId },
            data: {
                
            }
        })

        await tx.matchRound.update({
            where: {
                uid: currentRound?.uid,
                status: 'ACTIVE',
            },
            data: {
                status: 'FINISHED',
                winnerId: winnerId,
            },
        })

        await tx.match.update({
            where: { uid: matchId },
            data: {
                scoreA: totalA,
                scoreB: totalB,
            },
        })

        return { matchId, roundId: currentRound!.uid, scoreA: totalA, scoreB: totalB, winner: winnerId }
    })
}

export const handleWinner = async (matchId: string) => {
    return await prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({
            where: { uid: matchId },
            include: { rounds: true },
        })

        if (!match) throw new Error('Match not found')
        if (!match.rounds.length) throw new Error('No rounds found for this match')

        const bestOf = match.bestOf ?? 3
        const winTarget = Math.ceil(bestOf / 2)

        let teamAWins = 0
        let teamBWins = 0

        for (const round of match.rounds) {
            if (round.winnerId === match.teamAId) teamAWins++
            if (round.winnerId === match.teamBId) teamBWins++
        }

        let winnerId: string | null = null
        let status = match.status

        if (teamAWins >= winTarget || teamBWins >= winTarget) {
            winnerId = teamAWins > teamBWins ? match.teamAId : match.teamBId
            status = 'FINISHED'
        } else {
            status = 'ONGOING'
        }

        const updatedMatch = await tx.match.update({
            where: { uid: matchId },
            data: {
                scoreA: teamAWins,
                scoreB: teamBWins,
                winnerId: winnerId,
                status: status,
                updatedAt: new Date(),
            },
        })

        return updatedMatch
    })
}
