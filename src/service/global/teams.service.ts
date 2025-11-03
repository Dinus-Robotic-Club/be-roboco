import { prisma } from '../../config/prisma'
import { ICreateParticipant, IReqBodyCreateTeam, RegistrationStatus } from '../../utils/types/team'

export const getTeamByName = async (name: string) => {
    return await prisma.team.findMany({
        where: {
            name: name,
        },
    })
}

export const createTeam = async (data: IReqBodyCreateTeam) => {
    let team, registration
    let participants: ICreateParticipant[] = []

    await prisma.$transaction(async (tx) => {
        team = await tx.team.create({
            data: {
                ...data.team,
            },
        })
        for (const participant of data.participants) {
            const createdParticipant = await tx.participant.create({
                data: {
                    ...participant,
                    teamId: team.uid,
                },
            })
            participants.push(createdParticipant as ICreateParticipant)
        }
        registration = await tx.registration.create({
            data: {
                teamId: team.uid,
                status: 'PENDING',
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
            invoice: true,
            twibbon: true,
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
                    registeredAt: true,
                    verifiedAt: true,
                    attendances: {
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
