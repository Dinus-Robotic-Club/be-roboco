import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// import routes from './routes'
import morgan from 'morgan'
import helmet from 'helmet'

const PORT = process.env.PORT || 3000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())

// app.use('/api', routes)

app.get('/', (_, res) => res.send('🚀 Server is running'))

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

export default app
