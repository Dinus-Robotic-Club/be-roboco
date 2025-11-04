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

export const createTeam = async (data: IReqBodyCreateTeam) => {
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

export const createAttendenceWithScan = async (token: string, adminId: string) => {
    const decodeToken = decodeQrToken(token)
    if (!decodeToken) throw new Error('Failed decode token!')

    await prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({
            where: { uid: decodeToken.teamId },
            include: { registrations: true },
        })

        if (!team || team.registrations.length === 0) {
            throw new Error('Team or registration not found')
        }

        const registration = team.registrations[0]

        const existingAttendance = await tx.attendance.findUnique({
            where: { registrationId: registration.uid },
        })

        let attendance
        if (existingAttendance) {
            attendance = await tx.attendance.update({
                where: { registrationId: registration.uid },
                data: {
                    scannedBy: adminId,
                    isPresent: true,
                    scannedAt: new Date(),
                },
            })
        } else {
            attendance = await tx.attendance.create({
                data: {
                    registrationId: registration.uid,
                    scannedBy: adminId,
                    isPresent: true,
                    scannedAt: new Date(),
                },
            })
        }

        await tx.registration.update({
            where: { uid: registration.uid },
            data: { qrToken: null, qrUrl: null },
        })

        return attendance
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
            twibbon: true,
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
                },
            },
        },
    })
}
