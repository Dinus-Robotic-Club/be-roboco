import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { resetPasswordService } from '../../service/auth.service'
import { StatusCode } from '../../utils/types/types'

export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { newPassword, token } = req.body
        if (!token) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Token tidak ada atau tidak valid!', 'Token invalid or not found')
            return
        }

        if (!newPassword) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Password baru tidak boleh kosong!', 'new password cannot be empty')
            return
        }

        await resetPasswordService(newPassword, token as string)
        sendResponse(res, StatusCode.SUCCESS, 'Password berhasil di Reset!', 'Succes reset password')
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('Token tidak valid atau kadaluarsa')) {
            sendResponse(res, StatusCode.UNAUTHORIZED, 'Token tidak valid atau kadaluarsa!', errMessage)
            return
        } else if (errMessage.includes('token expired')) {
            sendResponse(res, StatusCode.UNAUTHORIZED, 'Token kadaluarsa!', errMessage)
            return
        } else if (errMessage.includes('invalid token')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Token tidak valid!', errMessage)
            return
        }
        console.error('Error reset : ', error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        return
    }
}
