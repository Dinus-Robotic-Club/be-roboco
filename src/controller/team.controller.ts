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
} from '../service/teams.service'
import { sendResponse } from '../utils/func/res'
import { ITokenPayload, StatusCode } from '../utils/types/types'
import { saveImageToDisk } from '../utils/upload'

export const createTeamController = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const files = req.files as Express.Multer.File[]

        const getFilesByField = (field: string) => files.filter((f) => f.fieldname.includes(field))

        const twibbon = saveImageToDisk(getFilesByField('twibbon')[0], 'twibbon')
        const invoice = saveImageToDisk(getFilesByField('invoice')[0], 'invoice')
        const logo = saveImageToDisk(getFilesByField('logo')[0], 'logo')

        const names = Array.isArray(body.participantsName) ? body.participantsName : [body.participantsName]
        const roles = Array.isArray(body.participantsRoleInTeam) ? body.participantsRoleInTeam : [body.participantsRoleInTeam]

        const images = getFilesByField('participantsImage').map((file, i) => saveImageToDisk(file, `participants${i}`))
        const idCards = getFilesByField('participantsIdentityCardImage').map((file, i) => saveImageToDisk(file, `id-card${i}`))

        const participants: ICreateParticipant[] = names.map((name: string, i: number) => ({
            name,
            roleInTeam: roles[i],
            image: images[i],
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

        const createdTeam = await createTeamService({ team, participants, twibbon, invoice }, body.tournamentId)

        sendResponse(res, StatusCode.CREATED, 'Team Created', createdTeam)
    } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('Team Name Exist')) {
            sendResponse(res, StatusCode.CONFLICT, 'Team Name Already Exists', errorMessage)
            return
        }
        if (errorMessage.includes('Tournament not found')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Tournament not found', errorMessage)
            return
        }
        if (errorMessage.includes('Email has been used')) {
            sendResponse(res, StatusCode.CONFLICT, 'Email has been used', errorMessage)
            return
        }
        console.error(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', (error as Error).message)
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
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing uid!')
            return
        }

        const data = await getProfileTeamService(uid)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get profile team!')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes get profile team!', data)
    } catch (error) {
        const errMessage = (error as Error).message
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!')
        console.log(error)
        console.log(errMessage)
    }
}

export const createAttendeanceController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid
        const { token } = req.body

        if (!userId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing user id!')
            return
        }

        if (!token) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing field token!')
            return
        }

        const data = await createAttendeanceService(token, userId)

        sendResponse(res, StatusCode.SUCCESS, 'Succes create attendeance!', data)
    } catch (error) {
        const errMsg = (error as Error).message
        if (errMsg.includes('')) {
            sendResponse(res, StatusCode.BAD_REQUEST, errMsg)
            return
        }
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', error)
    }
}

export const updateStatusRegistrationController = async (req: Request, res: Response) => {
    const { uid } = req.params
    const { status } = req.body
    try {
        console.log(uid)

        if (!status || !uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing uid or status! ')
            return
        }

        const team = await getTeamByUidService(uid)

        const data = await updateStatusRegistrationService(status, team!.name, team!.uid, team!.email)

        sendResponse(res, StatusCode.SUCCESS, 'Succes update status!', data)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Failed update status team!')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed update status team!')
        }

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', error)
        return
    }
}

export const deleteTeamController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.body

        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing team id or uid team', 'Missing team id or uid team')
            return
        }

        await deleteTeamService(uid)
        sendResponse(res, StatusCode.SUCCESS, 'Succes delete team!')
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('Team not found or team was deleted')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Team not found or team was deleted', errMessage)
            return
        }
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', errMessage)
    }
}
