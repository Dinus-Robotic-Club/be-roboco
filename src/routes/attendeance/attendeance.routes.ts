import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import { createAttendeanceController } from '../../controller/attendeance/attendeance.controller'

const router = Router()

router.post('/create', authMiddleware, createAttendeanceController)

export default router
