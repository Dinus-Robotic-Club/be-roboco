import { Router } from 'express'
import {
    createAttendeanceController,
    createTeamController,
    deleteTeamController,
    getAllTeamsController,
    getProfileTeamController,
    updateStatusRegistrationController,
} from '../controller/team.controller'
import authMiddleware from '../middleware/auth.middleware'
import { uploadTeamImage } from '../utils/upload'

const router = Router()

router.post('/registration', uploadTeamImage.any(), createTeamController)
router.post('/attendeance', authMiddleware, createAttendeanceController)
router.get('/get-all', getAllTeamsController)
router.get('/profile', authMiddleware, getProfileTeamController)
router.put('/update/:uid', updateStatusRegistrationController)
router.delete('/delete/:uid', deleteTeamController)

export default router
