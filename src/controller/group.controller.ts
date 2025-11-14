import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { createGroupService, getAllGroupsService } from '../service/group.service'

export const createGroupController = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params
        if (!tournamentId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing field tournamentId!')
            return
        }

        const group = await createGroupService(tournamentId)

        if (!group) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed create group')
            return
        }

        sendResponse(res, StatusCode.SUCCESS, 'Succes create group', group)
    } catch (error) {
        const errMessage = (error as Error).message
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!')
        console.log(error)
    }
}

export const getAllGroupController = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.params
        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing tournamentId')
            return
        }

        const data = await getAllGroupsService(tourId)
        sendResponse(res, StatusCode.SUCCESS, 'Succes get data', data)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
    }
}
