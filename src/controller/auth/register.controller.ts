import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { registerService } from '../../service/auth.service'
import { StatusCode } from '../../utils/types/types'
import { IRegisterUserInput } from '../../utils/types/auth'

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const body: IRegisterUserInput = req.body

        if (!body.email || !body.password) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Email atau password tidak ditemukan', 'Missing field email or password')
            return
        }

        await registerService(body)
        sendResponse(res, StatusCode.CREATED, 'user berhasil registrasi!', 'Succes register user')
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('User already exist!')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'User dengan email ini telah terdaftar!', errMessage)
            return
        }
        if (errMessage.includes('No file Provided')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'File tidak ditemukan!', errMessage)
            return
        }
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal server Error', 'Internal Server Error')
        console.error('Internal server Error ', error)
    }
}
