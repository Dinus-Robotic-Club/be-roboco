import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { forgotPasswordService } from '../../service/auth.service'
import { StatusCode } from '../../utils/types/types'

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        if (!email) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Email belum di input!')
            return
        }

        await forgotPasswordService(email)
        sendResponse(res, StatusCode.SUCCESS, 'lupa password berhasil dikirim ke email!')
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('User not found!')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'User tidak dengan email tersebut tidak ditemukan!', errMessage)
            return
        }
        console.log('Error : ', errMessage)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
    }
}
