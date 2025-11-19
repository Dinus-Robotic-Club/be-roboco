import { Router } from 'express'
import {
    createTournamentController,
    deleteTournamentController,
    getALlTournamentsController,
    getDetailTournamentController,
    updateSettingsController,
    updateTournamentController,
} from '../controller/tournament.controller'
import { uploadTourImage } from '../utils/upload'

const router = Router()

router.post('/create', uploadTourImage.any(), createTournamentController)
router.put('/:tourId/settings/update', updateSettingsController)
router.get('/get', getALlTournamentsController)
router.get('/get/:slug', getDetailTournamentController)
router.put('/update/:uid', uploadTourImage.any(), updateTournamentController)
router.delete('/delete/:uid', deleteTournamentController)

export default router
