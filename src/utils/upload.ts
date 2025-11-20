import multer from 'multer'
import path from 'path'
import fs from 'fs'

const BASE_UPLOAD_TEAM_PATH = path.resolve(__dirname, '../../uploads/team')
const BASE_UPLOAD_TOURNAMENT = path.resolve(__dirname, '../../uploads/tournament')

const FOLDER_MAP = {
    twibbon: path.join(BASE_UPLOAD_TEAM_PATH, 'twibbons'),
    invoice: path.join(BASE_UPLOAD_TEAM_PATH, 'invoices'),
    participant: path.join(BASE_UPLOAD_TEAM_PATH, 'participants'),
    idcard: path.join(BASE_UPLOAD_TEAM_PATH, 'id-cards'),
    logo: path.join(BASE_UPLOAD_TEAM_PATH, 'logo'),
    default: BASE_UPLOAD_TEAM_PATH,
    tourImage: BASE_UPLOAD_TOURNAMENT,
}

Object.values(FOLDER_MAP).forEach((folderPath) => {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed'))
    }
}

export const uploadTeamImage = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export const uploadTourImage = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export const saveImageToDisk = (file: Express.Multer.File, name: string, nameFile: string): string => {
    if (!file) throw new Error('No file provided')

    let targetFolder = FOLDER_MAP.default

    if (name.toLowerCase().includes('twibbon')) targetFolder = FOLDER_MAP.twibbon
    else if (name.toLowerCase().includes('invoice')) targetFolder = FOLDER_MAP.invoice
    else if (name.toLowerCase().includes('participant')) targetFolder = FOLDER_MAP.participant
    else if (name.toLowerCase().includes('logo')) targetFolder = FOLDER_MAP.logo
    else if (name.toLowerCase().includes('id-card') || name.toLowerCase().includes('identity')) targetFolder = FOLDER_MAP.idcard
    else if (name.toLocaleLowerCase().includes('image-tour')) targetFolder = FOLDER_MAP.tourImage

    const ext = path.extname(file.originalname)
    const filename = `${nameFile}-${name}`
    const fullPath = path.join(targetFolder, filename)

    fs.writeFileSync(fullPath, file.buffer)

    return `/uploads/${path.basename(targetFolder)}/${filename}`
}
