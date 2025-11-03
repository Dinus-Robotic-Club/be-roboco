import { Router } from 'express'
import { createTeamController, getAllTeamsController, updateStatusRegistrationController } from '../../controller/team/team.controller'
import { uploadTeamImage } from '../../utils/upload'

const router = Router()

router.post('/registration', uploadTeamImage.any(), createTeamController)
router.get('/get-all', getAllTeamsController)
router.put('/update/:uid', updateStatusRegistrationController)

export default router
