import authRoutes from './auth.routes'
import participantRoutes from '../routes/team.routes'
import tournamentRoutes from './tour.routes'
import groupRoutes from '../routes/group.routes'
import matchRoutes from '../routes/match.routes'

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
    {
        path: '/tournament',
        router: tournamentRoutes,
        middleware: [],
    },
    {
        path: '/groups',
        router: groupRoutes,
        middleware: [],
    },
    {
        path: '/matches',
        router: matchRoutes,
        middleware: [],
    },
]
