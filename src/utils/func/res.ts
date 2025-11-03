import { Response } from 'express'
import { IApiResponse, StatusCode } from '../types/types'

export const sendResponse = <T>(res: Response, status: StatusCode, message: string, data?: T): Response<IApiResponse<T>> => {
    const isSucces = status >= 200 && status < 300

    const response: IApiResponse<T> = {
        success: status >= 200 && status < 300,
        status,
        message,
        data: isSucces ? data : undefined,
        error: !isSucces ? data : undefined,
    }

    return res.status(status).json(response)
}
