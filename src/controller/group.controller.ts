import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { createGroupService, getAllGroupsService } from '../service/group.service'

export const createGroupController = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params
        if (!tournamentId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'turnamen id tidak ditemukan', 'Missing field tournament id')
            return
        }

        const group = await createGroupService(tournamentId)

        sendResponse(res, StatusCode.SUCCESS, 'Succes create group', group)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Tournament not found')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Turnamen tidak ditemukan', errMessage)
        }

        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        console.log(error)
    }
}

export const getAllGroupController = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.params
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Turnamen id tidak ditemukan', 'Missing field tournamentId')
            return
        }

        const data = await getAllGroupsService(tourId)
        sendResponse(res, StatusCode.SUCCESS, 'Succes get data', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
    }
}
