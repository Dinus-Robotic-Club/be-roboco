import { Router } from 'express'
import { createMatchController, createMatchRoundController, endMatchController, getMatchController, updateScoreController } from '../controller/match.controller'
const router = Router()

router.post('/create', createMatchController)
router.post('/get', getMatchController)
router.post('/round/:tourId/create/:matchId', createMatchRoundController)
router.put('/score/update/:matchId', updateScoreController)
router.post('/end/:matchId', endMatchController)

export default router
