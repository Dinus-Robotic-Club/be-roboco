import { nanoid } from 'nanoid'
import { IReqBodyCreateTeam, RegistrationStatus } from '../../utils/types/team'
import { createTeam, getTeamByName, updateStatusRegistrationTeam } from '../global/teams.service'
import { dateToString, generateQrImage } from '../../utils/func/global'
import { sendQrImage } from '../../utils/func/mailer'

export const createTeamService = async (data: IReqBodyCreateTeam) => {
    const existTeam = await getTeamByName(data.team.name)
    if (existTeam.length > 0) throw new Error('Team Name Exist')

    const team = await createTeam(data)
    return team
}

export const updateStatusRegistrationService = async (status: RegistrationStatus, name: string, uid: string, email: string) => {
    const qrToken = nanoid(10)
    const qrImage = await generateQrImage(qrToken, `QR-${name}`)

    const data = await updateStatusRegistrationTeam(uid, status, qrToken, qrImage)

    const dateString = dateToString(data?.createdAt as Date)

    const sendQR = await sendQrImage(email, qrImage, name, dateString)

    if (!sendQR) throw new Error('Failed send Qr')

    if (!data) {
        throw new Error('Failed update status team!')
    }
}
