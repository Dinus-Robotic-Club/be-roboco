import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { ICreateTournament, IUpdateTournament } from '../utils/types/tour'
import { createTournamentService, deleteTournamentService, getAllTournamentService, getDetailTournamentBySlugService, updateTournamentService } from '../service/tournament.service'

export const createTournamentController = async (req: Request, res: Response) => {
    try {
        const { data }: { data: ICreateTournament } = req.body

        if (!data || !data.name || !data.slug || !data.startDate || !data.playoffType || !data.stageType) {
            sendResponse(res, StatusCode.BAD_REQUEST, `Missing field : Name, Slug, StartDate, playoffType, stageType`)
            return
        }

        const response = await createTournamentService(data)

        if (!response) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed create tournament')
            return
        }

        sendResponse(res, StatusCode.CREATED, 'Tournament created!', response)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!')
        console.log(error)
    }
}

export const getALlTournamentsController = async (_: Request, res: Response) => {
    try {
        const data = await getAllTournamentService()
        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get all tournaments')
            return
        }
        sendResponse(res, StatusCode.SUCCESS, 'Succes get all tournaments', data)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!')
        console.log(error)
    }
}

export const getDetailTournamentController = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params

        if (!slug) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing field slug')
            return
        }

        const data = await getDetailTournamentBySlugService(slug)
        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get detail tournament')
            return
        }
        sendResponse(res, StatusCode.SUCCESS, 'Succes get detail tournaments', data)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
        console.log(error)
    }
}

export const updateTournamentController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const { data }: { data: IUpdateTournament } = req.body

        const response = await updateTournamentService(data, uid)
        if (!response) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed update tournament!')
            return
        }
        sendResponse(res, StatusCode.SUCCESS, 'Succes update tournament', response)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
        console.log(error)
    }
}

export const deleteTournamentController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing uid tournament!')
            return
        }

        const data = await deleteTournamentService(uid)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed delete tournament!')
            return
        }
        sendResponse(res, StatusCode.SUCCESS, 'Succes delete tournament')
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
        console.log(error)
    }
}
