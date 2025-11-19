import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { loginTeam, loginUser } from '../../service/auth.service'
import { StatusCode } from '../../utils/types/types'
import { ILoginTeamInput, ILoginUserInput } from '../../utils/types/auth'

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const data: ILoginUserInput = req.body

        if (!data.email || !data.password) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Email atau password harap di lengkapi!', 'Missing email or password')
            return
        }

        const response = await loginUser(data)

        sendResponse(res, StatusCode.SUCCESS, 'Login berhasil!', {
            token: response.access_token,
        })
    } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('user not found or password not set!')) {
            sendResponse(res, StatusCode.NOT_FOUND, 'Pengguna tidak ditemukan atau password belum di set!', errorMessage)
            return
        } else if (errorMessage.includes('Invalid Password')) {
            sendResponse(res, StatusCode.UNAUTHORIZED, 'Password tidak valid!', errorMessage)
            return
        }
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.error('Error login : ', error)
    }
}

export const loginTeamController = async (req: Request, res: Response) => {
    try {
        const data: ILoginTeamInput = req.body

        if (!data.password || !data.email) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'password atau email belum di input!')
            return
        }

        const response = await loginTeam(data)

        sendResponse(res, StatusCode.SUCCESS, 'Login berhasil!', {
            token: response.access_token,
        })
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Invalid Password')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Password tidak valid!', errMessage)
            return
        }
        console.log(errMessage)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
    }
}
