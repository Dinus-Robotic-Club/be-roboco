import { Request, Response } from 'express'
import { ICreateParticipant, ICreateTeam } from '../utils/types/team'
import {
    createAttendeanceService,
    createTeamService,
    deleteTeamService,
    getAllTeamsService,
    getProfileTeamService,
    getTeamByUidService,
    updateStatusRegistrationService,
    updateTeamService,
} from '../service/teams.service'
import { sendResponse } from '../utils/func/res'
import { ITokenPayload, StatusCode } from '../utils/types/types'
import { saveImageToDisk } from '../utils/upload'

export const createTeamController = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const files = req.files as Express.Multer.File[]

        console.log()

        const getFilesByField = (field: string) => files.filter((f) => f.fieldname.includes(field))

        const invoice = saveImageToDisk(getFilesByField('invoice')[0], 'invoice', body.name)
        const logo = saveImageToDisk(getFilesByField('logo')[0], 'logo', body.name)

        const names = Array.isArray(body.participantsName) ? body.participantsName : [body.participantsName]
        const roles = Array.isArray(body.participantsRoleInTeam) ? body.participantsRoleInTeam : [body.participantsRoleInTeam]
        const twibbon = Array.isArray(body.participantsTwibbon) ? body.participantsTwibbon : [body.participantsTwibbon]
        const phone = Array.isArray(body.participantsPhone) ? body.participantsPhone : [body.participantsPhone]

        const images = getFilesByField('participantsImage').map((file, i) => saveImageToDisk(file, `participants${i}`, names))
        const idCards = getFilesByField('participantsIdentityCardImage').map((file, i) => saveImageToDisk(file, `id-card${i}`, names))

        const participants: ICreateParticipant[] = names.map((name: string, i: number) => ({
            name,
            roleInTeam: roles[i],
            image: images[i],
            phone: phone[i],
            twibbon: twibbon[i],
            identityCardImage: idCards[i],
        }))

        const team: ICreateTeam = {
            name: body.name,
            school: body.school,
            password: body.password,
            category: body.category,
            email: body.email,
            logo: logo,
        }

        const createdTeam = await createTeamService({ team, participants, invoice }, body.tournamentId)

        sendResponse(res, StatusCode.CREATED, 'Team Created', createdTeam)
    } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('Team Name already exists')) {
            sendResponse(res, StatusCode.CONFLICT, 'Nama tim telah digunakan', errorMessage)
            return
        }
        if (errorMessage.includes('Tournament not found')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Tournament tidak ditemukan', errorMessage)
            return
        }
        if (errorMessage.includes('Email has been used')) {
            sendResponse(res, StatusCode.CONFLICT, 'Email telah digunakan', errorMessage)
            return
        }
        console.error(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const getAllTeamsController = async (_: Request, res: Response) => {
    try {
        const teams = await getAllTeamsService()
        sendResponse(res, StatusCode.SUCCESS, 'Success', teams)
    } catch (error) {
        console.error(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', (error as Error).message)
    }
}

export const getProfileTeamController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.user as ITokenPayload

        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Uid tidak ditemukan!', 'Missing uid')
            return
        }

        const data = await getProfileTeamService(uid)

        sendResponse(res, StatusCode.SUCCESS, 'Succes get profile team!', data)
    } catch (error) {
        const errMessage = (error as Error).message
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        console.log(error)
        console.log(errMessage)
    }
}

export const createAttendeanceController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid
        const { token } = req.body

        if (!userId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'User id tidak ditemukan', 'Missing user id')
            return
        }

        if (!token) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'token tidak ditemukan', 'Missing field token')
            return
        }

        const data = await createAttendeanceService(token, userId)

        sendResponse(res, StatusCode.SUCCESS, 'Succes create attendeance!', data)
    } catch (error) {
        const errMsg = (error as Error).message
        if (errMsg.includes('Failed decode token')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Gagal update kehadiran peserta', errMsg)
            return
        }
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const updateStatusRegistrationController = async (req: Request, res: Response) => {
    const { uid } = req.params
    const { status } = req.body
    try {
        console.log(uid)

        if (!status || !uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'uid atau status tidak ditemukan!', 'Missing uid or status')
            return
        }

        const team = await getTeamByUidService(uid)

        const data = await updateStatusRegistrationService(status, team!.name, team!.uid, team!.email)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses update status registrasi!', data)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Failed update status team!')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Gagal update status team!', errMessage)
        }

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        return
    }
}

export const deleteTeamController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.body

        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Uid tidak ditemukan', 'Missing team id or uid team')
            return
        }

        await deleteTeamService(uid)
        sendResponse(res, StatusCode.SUCCESS, 'Sukses hapus team')
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('Team not found or team was deleted')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Team tidak ditemukan atau team telah dihapus', errMessage)
            return
        }
        console.log('error: ', error)
        console.log('error message: ', errMessage)

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const updateTeamController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const data = req.body
        const imageLogo = req.files as Express.Multer.File[]

        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Uid tidak ditemukan', 'Missing uid')
            return
        }

        const logo = saveImageToDisk(imageLogo[0], 'logo', data.name)

        const resp = await updateTeamService(uid, data, logo)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses update team', resp)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Team not found')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Team tidak ditemukan', errMessage)
            return
        }

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.error(error)
    }
}

export const updateParticipantController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const data = req.body
        const imageUser = req.files as Express.Multer.File[]

        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'uid tidak ditemukan', 'Missing uid')
            return
        }

        const user = saveImageToDisk(imageUser[0], 'participants', data.name)

        const resp = await updateTeamService(uid, data, user)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses update peserta', resp)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Participant not found')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Peserta tidak ditemukan', errMessage)
            return
        }

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.error(error)
    }
}
