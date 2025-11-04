import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { loginUser } from '../../service/auth/auth.service'
import { StatusCode } from '../../utils/types/types'
import { ILoginUserInput } from '../../utils/types/auth'

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const data: ILoginUserInput = req.body

        if (!data.email || !data.password) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Email atau password harap di lengkapi!')
            return
        }

        const response = await loginUser(data)

        sendResponse(res, StatusCode.SUCCESS, 'Login berhasil!', {
            token: response.access_token,
        })
    } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('user not found or password not set!')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Pengguna tidak ditemukan atau password belum di set!')
            return
        } else if (errorMessage.includes('Invalid Password')) {
            sendResponse(res, StatusCode.UNAUTHORIZED, 'Password tidak valid!')
            return
        }
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
        console.error('Error login : ', error)
    }
}
