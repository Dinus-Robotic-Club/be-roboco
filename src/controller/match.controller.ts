import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { createMatchGroup, createMatchRound, getMatchGroup, handleWinner, updateScore } from '../service/match.service'

export const createMatchController = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.body
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Turnamen id tidak ditemukan', 'Missing tourId')
            return
        }
        const data = await createMatchGroup(tourId)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses membuat match', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const getMatchController = async (req: Request, res: Response) => {
    try {
        const { tourId, category } = req.body
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'field turnamen id tidak ditemukan', 'Missing field turnamen')
            return
        }
        const data = await getMatchGroup(tourId, category)

        sendResponse(res, StatusCode.SUCCESS, 'Succes get match group', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const createMatchRoundController = async (req: Request, res: Response) => {
    try {
        const { tourId, matchId } = req.params
        console.log(tourId, matchId)

        if (!tourId || !matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, ' turnamen id atau match id tidak ditemukan', 'Missing tour id or match id')
            return
        }
        const data = await createMatchRound(matchId, tourId)

        sendResponse(res, StatusCode.SUCCESS, 'Succes get match group', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const updateScoreController = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params
        const { teamId, gol, time } = req.body

        if (!matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, ' turnamen id atau match id tidak ditemukan', 'Missing tour id or match id')
            return
        }
        const data = await updateScore(matchId, teamId, gol, time)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses update score', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}

export const endMatchController = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params

        if (!matchId) {
            sendResponse(res, StatusCode.BAD_REQUEST, '  match id tidak ditemukan', 'Missing  match id')
            return
        }
        const data = await handleWinner(matchId)

        sendResponse(res, StatusCode.SUCCESS, 'Sukses mengakhiri match ', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}
