import { Request, Response } from 'express'
import { sendResponse } from '../utils/func/res'
import { StatusCode } from '../utils/types/types'
import { ICreateTournament, IUpdateSetting, IUpdateTournament } from '../utils/types/tour'
import {
    createTournamentService,
    deleteTournamentService,
    getAllTournamentService,
    getDetailTournamentBySlugService,
    updateSettingService,
    updateTournamentService,
} from '../service/tournament.service'
import { saveImageToDisk } from '../utils/upload'

export const createTournamentController = async (req: Request, res: Response) => {
    try {
        const body: ICreateTournament = req.body
        const images = req.files as Express.Multer.File[]
        console.log(body)

        const imageTournament = saveImageToDisk(images[0], 'image-tour', body.name)

        if (!body || !body.name || !body.slug || !body.startDate || !body.stageType) {
            sendResponse(res, StatusCode.BAD_REQUEST, `Field nama atau slug atau tanggal mulai atau tipe stage tidak ditemukan`)
            return
        }

        const response = await createTournamentService(body, imageTournament)

        sendResponse(res, StatusCode.CREATED, 'Turnamen terbuat', response)
    } catch (error) {
        const errMessage = (error as Error).message
        if (errMessage.includes('Tournament already exist')) {
            sendResponse(res, StatusCode.CONFLICT, 'Turnamen sudah ada', errMessage)
            return
        }
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        console.log(error)
    }
}

export const getALlTournamentsController = async (_: Request, res: Response) => {
    try {
        const data = await getAllTournamentService()
        sendResponse(res, StatusCode.SUCCESS, 'Sukses ambil semua turnamen', data)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error!', 'Internal Server Error')
        console.log(error)
    }
}

export const getDetailTournamentController = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params

        if (!slug) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'Slug tidak ditemukan')
            return
        }

        const data = await getDetailTournamentBySlugService(slug)
        sendResponse(res, StatusCode.SUCCESS, 'Sukses ambil detail turnamen', data)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.log(error)
    }
}

export const updateTournamentController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        const data: IUpdateTournament = req.body
        const images = req.files as Express.Multer.File[]

        const image = saveImageToDisk(images[0], 'image-tour', data.name as string)

        const response = await updateTournamentService(data, uid, image)
        sendResponse(res, StatusCode.SUCCESS, 'Sukses update turnamen', response)
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.log(error)
    }
}

export const deleteTournamentController = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params
        if (!uid) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'uid turnamen tidak ditemukan!', 'Missing uid tournament')
            return
        }

        const data = await deleteTournamentService(uid)

        sendResponse(res, StatusCode.SUCCESS, 'Succes delete tournament')
    } catch (error) {
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', 'Internal Server Error')
        console.log(error)
    }
}

export const updateSettingsController = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.params
        const { data }: { data: IUpdateSetting } = req.body

        if (!tourId) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'field Turnamen id tidak ditemukan')
            return
        }
        if (!data) {
            sendResponse(res, StatusCode.BAD_REQUEST, 'field data tidak ditemukan!')
            return
        }

        const updated = await updateSettingService(tourId, data)
        sendResponse(res, StatusCode.SUCCESS, 'Sukses update setting', updated)
    } catch (error) {
        console.log(error)
        sendResponse(res, StatusCode.INTERNAL_ERROR, 'Internal Server Error', error)
    }
}
