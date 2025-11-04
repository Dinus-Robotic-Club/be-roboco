import { NextFunction, Request, Response } from 'express'

import jwt from 'jsonwebtoken'
import { sendResponse } from '../utils/func/res'
import { verifyToken } from '../utils/func/jwt'
import { ITokenPayload } from '../utils/types/types'

declare module 'express' {
    interface Request {
        user?: ITokenPayload
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization')
    const header = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ') || !header) {
        sendResponse(res, 401, 'Unauthorized: Token is required or invalid format')
        return
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        const decoded = verifyToken(token)
        if (!decoded) {
            sendResponse(res, 401, 'Unauthorized: token invalid')
            return
        }
        req.user = decoded
        next()
    } catch (err) {
        console.log('Invalid or expired token:', err)
        if (err instanceof jwt.TokenExpiredError) {
            sendResponse(res, 401, 'Unauthorized: token expired')
            return
        } else if (err instanceof jwt.JsonWebTokenError) {
            sendResponse(res, 401, 'Unauthorized: token invalid')
            return
        }
        sendResponse(res, 401, 'Unauthorized: token expired')
        next(err)
        return
    }
}

export default authMiddleware
