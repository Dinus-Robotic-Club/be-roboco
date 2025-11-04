import { createAttendenceWithScan } from '../global/teams.service'

export const createAttendeanceService = async (token: string, adminId: string) => {
    return await createAttendenceWithScan(token, adminId)
}
