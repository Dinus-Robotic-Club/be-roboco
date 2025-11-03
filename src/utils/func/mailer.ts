import { Resend } from 'resend'
import { templateForgotPassword, templateResetPassword, templateSendQr } from '../../template/mail-page/template'
import * as dotenv from 'dotenv'

dotenv.config()

// Inisialisasi Resend client
const resend = new Resend(process.env.RESEND_API_KEY as string)

/**
 * Kirim email reset password
 */
export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
    try {
        const html = templateResetPassword(email, resetLink)
        const data = await resend.emails.send({
            from: `DN ROBOCO <no-reply@saptogusty@gmail.com>`,
            to: email,
            subject: 'Reset password akun anda',
            html,
        })

        console.log('✅ Email reset password terkirim:', data)
        return data
    } catch (error) {
        console.error('❌ Error kirim email reset password:', error)
        throw error
    }
}

/**
 * Kirim email lupa password
 */
export const sendForgotPasswordEmail = async (email: string, forgotLink: string) => {
    try {
        const html = templateForgotPassword(email, forgotLink)
        const data = await resend.emails.send({
            from: `DN ROBOCO <no-reply@saptogusty@gmail.com>`,
            to: email,
            subject: 'Reset password akun anda',
            html,
        })

        console.log('✅ Email forgot password terkirim:', data)
        return data
    } catch (error) {
        console.error('❌ Error kirim email forgot password:', error)
        throw error
    }
}

/**
 * Kirim QR code pendaftaran
 */
export const sendQrImage = async (email: string, QRCode: string, name: string, expired: string) => {
    try {
        const html = await templateSendQr(QRCode, name, expired)
        const data = await resend.emails.send({
            from: `DN ROBOCO <no-reply@saptogusty@gmail.com>`,
            to: email,
            subject: 'QR PENDAFTARAN ANDA',
            html,
        })

        console.log('✅ Email QR code terkirim:', data)
        return data
    } catch (error) {
        console.error('❌ Error kirim email QR code:', error)
        throw error
    }
}
