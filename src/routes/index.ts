import authRoutes from './auth/auth.routes'
import participantRoutes from '../routes/team/team.routes'
import attendeanceRoutes from '../routes/attendeance/attendeance.routes'
import tournamentRoutes from '../routes/tournament/tour.routes'
import groupRoutes from '../routes/group/group.routes'

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
        path: '/attendeance',
        router: attendeanceRoutes,
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
]
