import { prisma } from '../../config/prisma'
import { decodeQrToken, hashPassword } from '../../utils/func/global'
import { ICreateParticipant, IReqBodyCreateTeam, RegistrationStatus } from '../../utils/types/team'

export const getTeamByName = async (name: string) => {
    return await prisma.team.findUnique({
        where: {
            name: name,
        },
    })
}

export const createTeam = async (data: IReqBodyCreateTeam, tourId: string) => {
    let team, registration
    let participants: ICreateParticipant[] = []

    const hashPass = await hashPassword(data.team.password)

    await prisma.$transaction(async (tx) => {
        team = await tx.team.create({
            data: {
                ...data.team,
                password: hashPass,
            },
        })

        const createdParticipants = await Promise.all(
            data.participants.map((participant) =>
                tx.participant.create({
                    data: {
                        ...participant,
                        teamId: team!.uid,
                    },
                }),
            ),
        )
        participants.push(...(createdParticipants as ICreateParticipant[]))

        registration = await tx.registration.create({
            data: {
                teamId: team.uid,
                status: 'PENDING',
                tournamentId: tourId,
                twibbon: data.twibbon,
                invoice: data.invoice,
            },
        })
    })

    return { team, participants, registration }
}

export const getAllTeams = async () => {
    return await prisma.team.findMany({
        select: {
            uid: true,
            name: true,
            school: true,
            category: true,
            email: true,
            participants: {
                select: {
                    uid: true,
                    teamId: true,
                    name: true,
                    roleInTeam: true,
                    image: true,
                    identityCardImage: true,
                },
            },
            registrations: {
                select: {
                    uid: true,
                    teamId: true,
                    qrToken: true,
                    qrUrl: true,
                    status: true,
                    invoice: true,
                    twibbon: true,
                    registeredAt: true,
                    verifiedAt: true,
                    attendance: {
                        select: {
                            uid: true,
                            registrationId: true,
                            isPresent: true,
                            scannedBy: true,
                            scannedAt: true,
                        },
                    },
                },
            },
        },
    })
}

export const updateStatusRegistrationTeam = async (uid: string, status: RegistrationStatus, token: string, qrImage: string) => {
    let team

    const registration = await prisma.registration.findFirst({
        where: {
            teamId: uid,
        },
    })

    if (status === 'REJECTED') {
        team = await prisma.registration.update({
            where: {
                uid: registration!.uid,
            },
            data: {
                status: status,
            },
        })
    }

    if (status === 'APPROVED') {
        team = await prisma.registration.update({
            where: {
                uid: registration!.uid,
            },
            data: {
                status: status,
                qrToken: token,
                qrUrl: qrImage,
                verifiedAt: new Date(),
            },
        })
    }

    return team
}

export const getTeamByUid = async (uid: string) => {
    return await prisma.team.findUnique({
        where: {
            uid: uid,
        },
    })
}

export const getProfileTeam = async (uid: string) => {
    return await prisma.team.findUnique({
        where: {
            uid: uid,
        },
        select: {
            uid: true,
            email: true,
            name: true,
            school: true,
            category: true,
            participants: {
                select: {
                    uid: true,
                    name: true,
                    roleInTeam: true,
                    image: true,
                },
            },
            registrations: {
                select: {
                    uid: true,
                    qrUrl: true,
                    twibbon: true,
                },
            },
        },
    })
}
