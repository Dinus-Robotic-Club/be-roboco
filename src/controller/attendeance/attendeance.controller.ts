import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { StatusCode } from '../../utils/types/types'
import { createAttendeanceService } from '../../service/attendeance/attendeance.service'

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
