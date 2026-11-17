import { NextFunction, Request, Response, Router } from 'express'
import { Role } from '../../../generated/prisma/enums'
import { auth } from '../../middleware/checkAuth'
import { AuthController } from './auth.controller'

const router = Router()

router.post('/register',AuthController.registerTenant)
router.post('/login', AuthController.loginUser)
router.get(
    '/me',
    auth(Role.ADMIN, Role.PROPERTY_MANAGER, Role.PROPERTY_OWNER, Role.ROOM_MATE, Role.TENANT),
    AuthController.getMe,
)
router.post('/refresh-token', AuthController.refreshToken)

router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password', AuthController.resetPassword)




export const AuthRoutes = router;
