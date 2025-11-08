import { Router } from 'express'
import { createGroupController } from '../controller/group.controller'
const router = Router()

router.post('/create', createGroupController)

export default router
