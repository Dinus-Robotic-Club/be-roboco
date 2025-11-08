import { Router } from 'express'
import { createMatchController, getMatchController } from '../controller/match.controller'
const router = Router()

router.post('/create', createMatchController)
router.post('/get', getMatchController)

export default router
