import { Request, Response } from 'express'
import { ICreateParticipant, ICreateTeam } from '../../utils/types/team'
import { createTeamService, updateStatusRegistrationService } from '../../service/team/teams.service'
import { sendResponse } from '../../utils/func/res'
import { StatusCode } from '../../utils/types/types'
import { saveImageToDisk } from '../../utils/upload'
import { getAllTeams, getTeamByUid } from '../../service/global/teams.service'

export const createTeamController = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const files = req.files as Express.Multer.File[]

        console.log('body : ', body)
        console.log('files : ', files)

        const getFilesByField = (field: string) => files.filter((f) => f.fieldname.includes(field))

        const twibbon = saveImageToDisk(getFilesByField('twibbon')[0], 'twibbon')
        const invoice = saveImageToDisk(getFilesByField('invoice')[0], 'invoice')

        const names = Array.isArray(body.participantsName) ? body.participantsName : [body.participantsName]

        const roles = Array.isArray(body.participantsRoleInTeam) ? body.participantsRoleInTeam : [body.participantsRoleInTeam]

        const images = getFilesByField('participantsImage').map((file, i) => saveImageToDisk(file, `participants`))
        const idCards = getFilesByField('participantsIdentityCardImage').map((file, i) => saveImageToDisk(file, `id-card`))

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
            twibbon,
            invoice,
            category: body.category,
            email: body.email,
        }

        console.log('participants : ', participants)
        console.log('team : ', team)

        const createdTeam = await createTeamService({ team, participants })

        sendResponse(res, StatusCode.CREATED, 'Team Created', createdTeam)
    } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('Team Name Exist')) {
            return sendResponse(res, StatusCode.CONFLICT, 'Team Name Already Exists')
        }
        console.error(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', (error as Error).message)
    }
}

export const getAllTeamsController = async (req: Request, res: Response) => {
    try {
        const teams = await getAllTeams()
        sendResponse(res, StatusCode.SUCCESS, 'Success', teams)
    } catch (error) {
        console.error(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', (error as Error).message)
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

        const team = await getTeamByUid(uid)

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
