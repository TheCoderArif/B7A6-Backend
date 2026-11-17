import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from "http-status"
import config from './app/config'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
import { AuthRoutes } from './app/module/auth/auth.route'
import z from 'zod'
import { redisClient } from './app/lib/redis'
import crypto from "crypto"

const app: Application = express()

app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
)

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }))

// Middleware to parse JSON bodies
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', AuthRoutes)

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to Housing & Roommate Management Platform System Backend',
    })
})





// For testing
app.get('/test', async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        // await redisClient.set("forgot-password-otp:user1@gmail.com", "123456", {
        //     expiration: {
        //         type : "EX",
        //         value : 5 * 60
        //     }
        // });

        // const otp = crypto.randomInt(100000, 1000000);
        // console.log(otp);

    res.status(httpStatus.OK).json({
        success: true,
        message: 'This is testing route...',
        data: otp,
    })
    } catch (error) {
        next(error);
    }
   
});









app.use(globalErrorHandler)
app.use(notFound)

export default app
