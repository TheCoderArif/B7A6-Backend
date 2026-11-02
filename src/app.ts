import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from "http-status"
import config from './app/config'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
import { AuthRoutes } from './app/module/auth/auth.route'
import z from 'zod'

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
app.post('/test', async (req: Request, res: Response, next: NextFunction) => {

    try {
         const UserZodSchema = z.object({
        name : z.string().optional(),
        email: z.email(),
        age: z.number().optional(),
        inVerified: z.boolean().optional()
    });

    const payload = req.body;
    const result = UserZodSchema.safeParse(payload);

    if(!result.success) {
        console.log(result.error);
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: 'This is testing route...',
        data: result
    })
    } catch (error) {
        next(error);
    }
   
});









app.use(globalErrorHandler)
app.use(notFound)

export default app
