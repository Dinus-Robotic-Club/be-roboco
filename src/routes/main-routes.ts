import { Router } from 'express'
import { routes } from './index'

const router = Router()

routes.forEach(({ path, router: routeRouter, middleware }) => {
    if (middleware) {
        const middlewares = Array.isArray(middleware) ? middleware : [middleware]
        router.use(path, ...middlewares, routeRouter)
    } else {
        router.use(path, routeRouter)
    }
})

export default router
