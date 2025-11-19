import { Router } from 'express'
import {
    createAttendeanceController,
    createTeamController,
    deleteTeamController,
    getAllTeamsController,
    getProfileTeamController,
    updateParticipantController,
    updateStatusRegistrationController,
    updateTeamController,
} from '../controller/team.controller'
import authMiddleware from '../middleware/auth.middleware'
import { uploadTeamImage } from '../utils/upload'

const router = Router()

router.post('/registration', uploadTeamImage.any(), createTeamController)
router.put('update/:uid', uploadTeamImage.any(), updateTeamController)
router.put('/update/participant/:uid', uploadTeamImage.any, updateParticipantController)
router.post('/attendeance', authMiddleware, createAttendeanceController)
router.get('/get-all', getAllTeamsController)
router.get('/profile', authMiddleware, getProfileTeamController)
router.put('/update/:uid/status', updateStatusRegistrationController)
router.delete('/delete/:uid', deleteTeamController)

export default router
