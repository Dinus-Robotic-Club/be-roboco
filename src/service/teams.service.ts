import { ICreateParticipant, IReqBodyCreateTeam, RegistrationStatus } from '../utils/types/team'
import { dateToString, generateQrImage, generateQrToken, hashPassword } from '../utils/func/global'
import { sendQrImage } from '../utils/func/mailer'
import { prisma } from '../config/prisma'
import { decodeQrToken } from '../utils/func/global'

export const getTeamByNameService = async (name: string) => {
    return await prisma.team.findUnique({
        where: {
            name: name,
        },
    })
}

export const getAllTeamsService = async () => {
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

export const getProfileTeamService = async (uid: string) => {
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

export const getTeamByUidService = async (uid: string) => {
    return await prisma.team.findUnique({
        where: { uid },
    })
}

export const createTeamService = async (data: IReqBodyCreateTeam, tourId: string) => {
    const existTeam = await getTeamByNameService(data.team.name)

    const existEmail = await prisma.team.findUnique({
        where: { email: data.team.email },
    })

    if (existTeam) throw new Error('Team Name already exists')
    if (existEmail) throw new Error('Email has been used')

    let team
    let participants: ICreateParticipant[] = []

    const hashPass = await hashPassword(data.team.password)

    return await prisma.$transaction(async (tx) => {
        team = await tx.team.create({
            data: {
                ...data.team,
                password: hashPass,
            },
            omit: {
                password: true,
                point: true,
                golScore: true,
                golConfident: true,
                golDifferent: true,
                knockoutConfident: true,
                knockoutDifferent: true,
                knockoutScore: true,
                matchPlay: true,
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

        await tx.registration.create({
            data: {
                teamId: team.uid,
                status: 'PENDING',
                tournamentId: tourId,
                twibbon: data.twibbon,
                invoice: data.invoice,
            },
        })
        return { team, participants }
    })
}

export const createAttendeanceService = async (token: string, adminId: string) => {
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

export const updateStatusRegistrationService = async (status: RegistrationStatus, name: string, teamId: string, email: string) => {
    const qrToken = generateQrToken(teamId)
    if (!qrToken) throw new Error('Failed generate QR token!')

    const qrImage = await generateQrImage(qrToken, `QR-${name}`)
    if (!qrImage) throw new Error('Failed generate QR image!')

    return await prisma.$transaction(async (tx) => {
        let data
        const registration = await tx.registration.findFirst({
            where: {
                teamId: teamId,
            },
        })

        if (!registration) throw new Error('Registration not found, please check ur team')

        if (status === 'REJECTED') {
            data = await tx.registration.update({
                where: {
                    uid: registration!.uid,
                },
                data: {
                    status: status,
                },
            })
        }

        if (status === 'APPROVED') {
            data = await tx.registration.update({
                where: {
                    uid: registration!.uid,
                },
                data: {
                    status: status,
                    qrToken: qrToken,
                    qrUrl: qrImage,
                    verifiedAt: new Date(),
                },
            })
        }
        if (!data) throw new Error('Failed update status team!')

        const dateString = dateToString(data?.createdAt as Date)
        const sendQR = await sendQrImage(email, qrImage, name, dateString)

        if (!sendQR) throw new Error('Failed send Qr')
    })
}

export const deleteTeamService = async (uid: string) => {
    return await prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({
            where: { uid },
        })

        if (!team) throw new Error('Team not found or team was deleted')

        await tx.registration.deleteMany({
            where: {
                teamId: team!.uid,
            },
        })

        await tx.groupTeam.deleteMany({
            where: {
                teamId: team?.uid,
            },
        })

        await tx.participant.deleteMany({
            where: {
                teamId: team?.uid,
            },
        })

        await tx.team.delete({
            where: { uid },
        })
    })
}
