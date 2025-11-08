import { prisma } from '../config/prisma'
import { decodeQrToken } from '../utils/func/global'

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
