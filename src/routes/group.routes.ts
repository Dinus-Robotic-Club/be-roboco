import { Router } from 'express'
import { createGroupController, getAllGroupController } from '../controller/group.controller'
const router = Router()

router.post('/create', createGroupController)
router.get('/get/:tourId', getAllGroupController)

export default router
