import { Router } from 'express'
import { loginTeamController, loginUserController } from '../controller/auth/login.controller'
import { registerUserController } from '../controller/auth/register.controller'
import { forgotPasswordController } from '../controller/auth/forgot.controller'
import { resetPasswordController } from '../controller/auth/reset.controller'

// import authMiddleware from '../../middlewares/middleware'

const router = Router()

router.post('/user/login', loginUserController)
router.post('/participant/login', loginTeamController)
router.post('/user/register', registerUserController)
router.post('/user/forgot-password', forgotPasswordController)
router.post('/user/reset-password', resetPasswordController)

export default router
