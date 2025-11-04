import { Router } from 'express'
import { createTeamController, getAllTeamsController, getProfileTeamController, updateStatusRegistrationController } from '../../controller/team/team.controller'
import { uploadTeamImage } from '../../utils/upload'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

router.post('/registration', uploadTeamImage.any(), createTeamController)
router.get('/get-all', getAllTeamsController)
router.get('/profile', authMiddleware, getProfileTeamController)
router.put('/update/:uid', updateStatusRegistrationController)

export default router
