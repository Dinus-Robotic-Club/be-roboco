import { Request, Response } from 'express'
import { sendResponse } from '../../utils/func/res'
import { loginTeam, loginUser } from '../../service/auth/auth.service'
import { StatusCode } from '../../utils/types/types'
import { ILoginTeamInput, ILoginUserInput } from '../../utils/types/auth'

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
        1
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error')
        console.error('Error login : ', error)
    }
}

export const loginTeamController = async (req: Request, res: Response) => {
    try {
        const data: ILoginTeamInput = req.body

        if (!data.password || !data.name) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Missing field username or password!')
            return
        }

        const response = await loginTeam(data)
        if (!response) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Failed login!')
            return
        }
        sendResponse(res, StatusCode.SUCCESS, 'Login Succesfully!', response)
    } catch (error) {
        const errMessage = (error as Error).message

        if (errMessage.includes('Invalid Password')) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Invalid Password!')
            return
        }
        console.log(errMessage)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!')
    }
}
