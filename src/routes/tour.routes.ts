import { Router } from 'express'
import {
    createTournamentController,
    deleteTournamentController,
    getALlTournamentsController,
    getDetailTournamentController,
    updateSettingsController,
    updateTournamentController,
} from '../controller/tournament.controller'

const router = Router()

router.post('/create', createTournamentController)
router.put('/:tourId/settings/update', updateSettingsController)
router.get('/get', getALlTournamentsController)
router.get('/get/:slug', getDetailTournamentController)
router.put('/update/:uid', updateTournamentController)
router.delete('/delete/:uid', deleteTournamentController)

export default router
