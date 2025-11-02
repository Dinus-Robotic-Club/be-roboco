import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
// import routes from './routes'
import morgan from 'morgan'
import helmet from 'helmet'
import { connectPrisma, prisma } from './config/prisma'

const PORT = process.env.PORT || 3000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())

app.get('/', (_, res) => res.send('🚀 Server is running'))

connectPrisma()

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

export default app
