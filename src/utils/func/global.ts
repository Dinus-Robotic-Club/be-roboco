import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

export const generateQrImage = async (qrToken: string, text: string) => {
    try {
        const folderPath = path.join(process.cwd(), 'uploads', 'qrcode')

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }

        console.log(folderPath)

        const fileName = `${text}.png`
        const filePath = path.join(folderPath, fileName)

        await QRCode.toFile(filePath, qrToken, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        })

        return `/uploads/qrcode/${fileName}`
    } catch (error) {
        console.error('❌ Gagal membuat QR Code:', error)
        throw new Error('Failed to generate QR code')
    }
}

export const hashPassword = async (pass: string): Promise<string> => {
    return await bcrypt.hash(pass, 10)
}

export const comparePassword = async (pass: string, hash: string) => {
    return await bcrypt.compare(pass, hash)
}

export const dateToString = (date: Date) => {
    return new Date(date).toString()
}

export const generateQrToken = (teamId: string) => {
    const token = `${teamId}:${nanoid(10)}`
    return Buffer.from(token).toString('base64')
}

export const decodeQrToken = (token: string) => {
    const decode = Buffer.from(token, 'base64').toString('utf-8')
    const [teamId, random] = decode.split(':')
    return { teamId, random }
}
