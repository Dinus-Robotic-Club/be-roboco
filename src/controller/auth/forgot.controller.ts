import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { forgotPasswordService } from '../../service/auth/auth.service'

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        if (!email) {
            sendResponse(res, 400, 'Mohon lengkapi data yang ada!')
            return
        }

        await forgotPasswordService(email)
        sendResponse(res, 200, 'Forgot password berhasil dikirim ke email!')
    } catch (error) {
        const errMessage = (error as Error).message || 'Internal Server Error!'
        if (errMessage.includes('User not found!')) {
            sendResponse(res, 404, 'User tidak dengan email tersebut tidak ditemukan!')
            return
        }
        console.log('Error : ', errMessage)
        sendResponse(res, 500, 'Internal Server Error!')
    }
}
