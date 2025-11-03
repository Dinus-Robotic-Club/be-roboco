import authRoutes from './auth/auth.routes'
import participantRoutes from '../routes/team/team.routes'

export const routes = [
    {
        path: '/auth',
        router: authRoutes,
        middleware: [],
    },
    {
        path: '/teams',
        router: participantRoutes,
        middleware: [],
    },
]
