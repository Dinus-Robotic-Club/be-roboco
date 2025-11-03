import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { resetPasswordService } from '../../service/auth/auth.service'

export const resetPasswordController = async (req: Request, res: Response) => {
    const { newPassword, token } = req.body

    try {
        if (!token) {
            sendResponse(res, 400, 'Token tidak ada atau tidak valid!')
            return
        }

        if (!newPassword) {
            sendResponse(res, 400, 'Password baru tidak boleh kosong!')
            return
        }

        await resetPasswordService(newPassword, token as string)
        sendResponse(res, 200, 'Password berhasil di Reset!')
    } catch (error) {
        const errMessage = (error as Error).message || 'Internal Server Error!'
        if (errMessage.includes('Token tidak valid atau kadaluarsa')) {
            sendResponse(res, 401, 'Token tidak valid atau kadaluarsa!')
            return
        } else if (errMessage.includes('token expired')) {
            sendResponse(res, 401, 'Token kadaluarsa!')
            return
        } else if (errMessage.includes('invalid token')) {
            sendResponse(res, 400, 'Invalid token!')
            return
        }
        console.error('Error reset : ', error)
        sendResponse(res, 500, 'Internal Server Error!')
        return
    }
}
