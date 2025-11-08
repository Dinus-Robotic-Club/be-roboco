import { Router } from 'express'
import {
    createTournamentController,
    deleteTournamentController,
    getALlTournamentsController,
    getDetailTournamentController,
    updateTournamentController,
} from '../controller/tournament.controller'
import authMiddleware from '../middleware/auth.middleware'

const router = Router()

router.post('/create', createTournamentController)
router.get('/get', getALlTournamentsController)
router.get('/get/:slug', getDetailTournamentController)
router.put('/update/:uid', updateTournamentController)
router.delete('/delete/:uid', deleteTournamentController)

export default router
