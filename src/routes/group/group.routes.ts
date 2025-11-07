import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import { createGroupController } from '../../controller/group/group.controller'

const router = Router()

router.post('/create', createGroupController)

export default router
