import { prisma } from '../../config/prisma'
import { hashPassword } from '../../utils/func/global'
import { IRegisterUserInput } from '../../utils/types/auth'

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    })
}

export const createUser = async (data: IRegisterUserInput) => {
    const hashedPassword = await hashPassword(data.password)
    return await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    })
}

export const updateResetTokenUser = async (email: string, ResetToken: string | null) => {
    return await prisma.user.update({
        where: {
            email,
        },
        data: {
            resetToken: ResetToken,
        },
    })
}

export const updatePasswordUser = async (email: string, newPassword: string) => {
    const pass = await hashPassword(newPassword)
    return await prisma.user.update({
        where: {
            email,
        },
        data: {
            password: pass,
        },
    })
}
