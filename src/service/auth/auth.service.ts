import { generateResetToken, generateToken, verifyResetToken } from '../../utils/func/jwt'
import { createUser, getUserByEmail, updatePasswordUser, updateResetTokenUser } from '../global/user.service'
import { comparePassword } from '../../utils/func/global'
import { ILoginTeamInput, ILoginUserInput, IRegisterUserInput, IResponseLogin } from '../../utils/types/auth'
import { sendForgotPasswordEmail } from '../../utils/func/mailer'
import * as dotenv from 'dotenv'
import { getTeamByName } from '../global/teams.service'

dotenv.config()

export const registerService = async (data: IRegisterUserInput) => {
    try {
        const existUser = await getUserByEmail(data.email)
        if (existUser) throw new Error('User Exist')

        const user = await createUser(data)
        if (!user) throw new Error('Failed to create user')

        return user
    } catch (error) {
        console.log(error)
        throw new Error('Failed to register user')
    }
}

export const loginUser = async (data: ILoginUserInput): Promise<IResponseLogin> => {
    const user = await getUserByEmail(data.email)

    if (!user || !user.password) throw new Error('user not found or password not set!')

    const isPasswordMatch = await comparePassword(data.password, user.password)
    if (!isPasswordMatch) throw new Error('Invalid Password')

    const payload = {
        uid: user.uid,
        email: user.email,
        name: user.name,
    }

    const token = generateToken(payload)

    return {
        access_token: token,
    }
}

export const forgotPasswordService = async (email: string) => {
    const user = await getUserByEmail(email)

    if (!user) throw new Error('User not found!')

    const token = generateResetToken(email)
    const resetLink = `${process.env.URL_FRONTEND}/auth/reset-password?token=${token}`

    try {
        await updateResetTokenUser(email, token)

        await sendForgotPasswordEmail(email, resetLink)

        return { message: 'A password reset link has been sent to your email address.' }
    } catch (error) {
        console.error(`Failed to process forgot for ${email}: `, error)
        throw new Error('Failed to send password reset email. Please try again later.')
    }
}

export const resetPasswordService = async (newPassword: string, token: string) => {
    const email = verifyResetToken(token)
    const user = await getUserByEmail(email as string)

    if (user?.resetToken !== token) throw new Error('Token tidak valid atau kadaluarsa')

    await updatePasswordUser(email as string, newPassword).then(() => {
        return updateResetTokenUser(email as string, null)
    })

    return
}

export const loginTeam = async (data: ILoginTeamInput): Promise<IResponseLogin> => {
    const user = await getTeamByName(data.name)

    console.log(user)

    if (!user || !user.name) throw new Error('user not found or password not set!')

    const isPasswordMatch = await comparePassword(data.password, user.password)
    if (!isPasswordMatch) throw new Error('Invalid Password')

    const payload = {
        uid: user.uid,
        email: user.email,
        name: user.name,
    }

    const token = generateToken(payload)

    return {
        access_token: token,
    }
}
