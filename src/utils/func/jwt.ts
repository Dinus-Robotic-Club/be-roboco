import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { ITokenPayload } from '../types/types'

dotenv.config()

const SECRET_TOKEN = process.env.JWT_SECRET as string

export const generateToken = (payload: ITokenPayload): string => {
    return jwt.sign(payload, SECRET_TOKEN, {
        expiresIn: '7d',
        algorithm: 'HS256',
    })
}

export const verifyToken = (token: string): ITokenPayload => {
    return jwt.verify(token, SECRET_TOKEN) as ITokenPayload
}

export const generateResetToken = (email: string): string => {
    return jwt.sign({ email }, SECRET_TOKEN, {
        expiresIn: '15m',
        algorithm: 'HS256',
    })
}

export const verifyResetToken = (token: string): string | null => {
    try {
        const decode = jwt.verify(token, SECRET_TOKEN) as { email: string }
        return decode.email
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('token expired')
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('invalid token')
        } else {
            throw new Error('token verification failed')
        }
    }
}
