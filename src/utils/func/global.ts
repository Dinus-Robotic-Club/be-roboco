import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'
import QRCode from 'qrcode'

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

export const comparePassword = async (pass: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(pass, hash)
}

export const dateToString = (date: Date) => {
    return new Date(date).toString()
}
