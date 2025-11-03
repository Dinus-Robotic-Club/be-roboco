import nodemailer from 'nodemailer'
import { templateForgotPassword, templateResetPassword, templateSendQr } from '../../template/mail-page/template'
import * as dotenv from 'dotenv'
import path from 'path'

const PUBLIC_PATH = path.resolve(__dirname, '../../public')

dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"support" <${process.env.EMAIL_USER as string}>`,
            to: email,
            subject: 'Reset password akun anda',
            html: templateResetPassword(email, resetLink),
        })

        console.log('Email terkirim ke : ', info.messageId)
        return info
    } catch (error) {
        console.error('Error send email : ', error)
        throw error
    }
}

export const sendForgotPasswordEmail = async (email: string, forgotLink: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"support" <${process.env.EMAIL_USER as string}>`,
            to: email,
            subject: 'Reset password akun anda',
            html: templateForgotPassword(email, forgotLink),
        })

        console.log('Email terkirim ke : ', info.messageId)
        return info
    } catch (error) {
        console.error('Error send email : ', error)
        throw error
    }
}

export const sendQrImage = async (email: string, QRCode: string, name: string, expired: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"DN ROBOCO" <${process.env.EMAIL_USER as string}>`,
            to: email,
            subject: 'QR PENDAFTARAN ANDA',
            html: await templateSendQr(QRCode, name, expired),
        })

        console.log('Email terkirim ke : ', info.messageId)
        return info
    } catch (error) {
        console.error('Error send email : ', error)
        throw error
    }
}
