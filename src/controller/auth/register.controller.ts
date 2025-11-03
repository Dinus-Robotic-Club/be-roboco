import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { registerService } from '../../service/auth/auth.service'
import { StatusCode } from '../../utils/types/types'
import { IRegisterUserInput } from '../../utils/types/auth'

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const body: IRegisterUserInput = req.body

        if (!body.email || !body.password) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Mohon lengkapi data diatas!')
            return
        }

        await registerService(body)
        sendResponse(res, StatusCode.CREATED, 'Register user berhasil!')
    } catch (error) {
        const errMessage = (error as Error).message || 'Internal Server Error'
        if (errMessage.includes('User already exist!')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'User dengan email ini telah terdaftar, gunakan email atau nomor lain untuk registrasi!')
            return
        }
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal server Error')
        console.error('Internal server Error ', error)
    }
}
