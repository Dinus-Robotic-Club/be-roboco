import { Router } from 'express'
import { createTeamController, getAllTeamsController, getProfileTeamController, updateStatusRegistrationController } from '../controller/team.controller'
import authMiddleware from '../middleware/auth.middleware'
import { uploadTeamImage } from '../utils/upload'

const router = Router()

router.post('/registration', uploadTeamImage.any(), createTeamController)
router.get('/get-all', getAllTeamsController)
router.get('/profile', authMiddleware, getProfileTeamController)
router.put('/update/:uid', updateStatusRegistrationController)

export default router
