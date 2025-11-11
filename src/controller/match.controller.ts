import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { createMatchGroup, createMatchRound, getMatchGroup, handleWinner, updateScore } from '../service/match.service'

export const createMatchController = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.body
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tourID')
            return
        }
        const data = await createMatchGroup(tourId)

        sendResponse(res, StatusCode.SUCCESS, 'Succes created match', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}

export const getMatchController = async (req: Request, res: Response) => {
    try {
        const { tourId, category } = req.body
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tourID')
            return
        }
        const data = await getMatchGroup(tourId, category)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get data')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes get match group', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}
export const createMatchRoundController = async (req: Request, res: Response) => {
    try {
        const { tourId, matchId } = req.params
        console.log(tourId, matchId)

        if (!tourId || !matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tourId or match Id')
            return
        }
        const data = await createMatchRound(matchId, tourId)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get data')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes get match group', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}

export const updateScoreController = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params
        const { teamId, gol, time } = req.body

        if (!matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tourId or match Id')
            return
        }
        const data = await updateScore(matchId, teamId, gol, time)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get data')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes get match group', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}

export const endMatchController = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params

        if (!matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tourId or match Id')
            return
        }
        const data = await handleWinner(matchId)

        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed get data')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes end match ', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}
