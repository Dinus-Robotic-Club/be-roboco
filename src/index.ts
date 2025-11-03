import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
// import routes from './routes'
import morgan from 'morgan'
import helmet from 'helmet'
import { connectPrisma } from './config/prisma'
import mainRoutes from './routes/main-routes'
import path from 'path'

const PORT = process.env.PORT || 3000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use('/public', express.static(path.join(__dirname, '../public')))
app.use('/qr', express.static('src/uploads/qrcode'))

app.get('/', (_, res) => res.send('🚀 Server is running'))
app.use('/api', mainRoutes)

connectPrisma()

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

export default app
