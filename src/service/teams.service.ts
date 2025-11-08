import { IReqBodyCreateTeam, RegistrationStatus } from '../utils/types/team'
import { createTeam, getTeamByName, updateStatusRegistrationTeam } from './global/teams.service'
import { dateToString, generateQrImage, generateQrToken } from '../utils/func/global'
import { sendQrImage } from '../utils/func/mailer'

export const createTeamService = async (data: IReqBodyCreateTeam, tourId: string) => {
    const existTeam = await getTeamByName(data.team.name)
    if (existTeam) throw new Error('Team Name Exist')

    const team = await createTeam(data, tourId)
    return team
}

export const updateStatusRegistrationService = async (status: RegistrationStatus, name: string, teamId: string, email: string) => {
    const qrToken = generateQrToken(teamId)
    if (!qrToken) throw new Error('Failed generate QR token!')

    const qrImage = await generateQrImage(qrToken, `QR-${name}`)
    if (!qrImage) throw new Error('Failed generate QR image!')

    const data = await updateStatusRegistrationTeam(teamId, status, qrToken, qrImage)

    const dateString = dateToString(data?.createdAt as Date)

    const sendQR = await sendQrImage(email, qrImage, name, dateString)

    if (!sendQR) throw new Error('Failed send Qr')

    if (!data) throw new Error('Failed update status team!')
}
