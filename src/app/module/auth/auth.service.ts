import bcrypt from 'bcryptjs'
import { JwtPayload, SignOptions } from 'jsonwebtoken'
import { Role, UserStatus } from '../../../generated/prisma/enums'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { jwtUtils } from '../../utils/jwt'
import {
    IForgotPasswordPayload,
    ILoginUserPayload,
    IRegisterTenantPayload,
    IRequestUser,
    IResetPasswordPayload
} from './auth.interface'
import { ne } from 'zod/locales'
import crypto from "crypto"
import { redisClient } from '../../lib/redis'
import { transporter } from '../../lib/nodeMailer'
import { parseDataURI } from 'nodemailer/lib/shared'
import ejs from "ejs"

import path from "path";





const registerTenant = async (payload: IRegisterTenantPayload) => {
    const { name, password, tenant : tenantData } = payload
    const email = payload.email.trim().toLowerCase()

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    })

    if (isUserExists) {
        throw new Error('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));


    const expirationSeconds = 5 * 60;

    const otpKey = `tenant-registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    await redisClient.set(otpKey, otpValue, {
        expiration: {
            type: "EX",
            value: expirationSeconds
        }
    });


    
    const tenantRegistrationKey = `tenant-registration-data:${email}`
    const redisUserDataPayload = {
        name,
        email,
        password: hashedPassword,
        tenant: tenantData
    };

    await redisClient.set(tenantRegistrationKey, JSON.stringify(redisUserDataPayload), {
        expiration: {
            type: "EX",
            value: expirationSeconds
        }
    });

    const templatePath = path.join(process.cwd(), "src/app/templates/email-verification-otp.ejs");
    const templateData = {
        name: name,
        email: email,
        otp: otpValue,
        expirationMinutes: expirationSeconds / 60
    }

    const htmlTemplate = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: email,
        subject: "Email Verification",
        // text: `Your OTP is ${otp}`,
        html: htmlTemplate
    });



/*

     const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.TENANT,
            status: UserStatus.ACTIVE,
            emailVerified: false,
            tenant: {
                create: { name, email, contactNumber : tenantData.contactNumber || "" },
            },
        },
        omit: { password: true },
        include: { tenant: true },
    })

    const { tenant, ...user } = createdUser
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        user,
        tenant,
        accessToken,
        refreshToken
    }

*/


};

const loginUser = async (payload: ILoginUserPayload) => {
    const { password } = payload
    const email = payload.email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new Error('User not found')
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new Error('User is blocked')
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new Error('User is deleted')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        throw new Error('Invalid credentials')
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }
}

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            tenant: true,
        },
        omit: {
            password: true,
        },
    })

    if (!isUserExists) {
        throw new Error('User not found')
    }

    return isUserExists
}

const refreshToken = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret)

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new Error(config.node_env === 'development' ? verifiedRefreshToken.error : 'Invalid refresh token')
    }

    const data = verifiedRefreshToken.data as JwtPayload

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    })

    if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
        throw new Error('User is inactive or not found')
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }
}

const forgotPassword = async (payload : IForgotPasswordPayload) => {
    const {email} = payload;
    
    const isUserExists = await prisma.user.findUnique({
        where : {
            email
        }
    });

    if(!isUserExists){
        throw new Error("User Does not Exist!")
    }
    if (isUserExists.status === "BLOCKED"){
        throw new Error("User Blocked")
    }
    if (isUserExists.isDeleted || isUserExists.status === "DELETED"){
        throw new Error ("User Deleted")
    }

    const expirationSeconds = 5 * 60;
    
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    const key = `forgot-password-otp:${isUserExists.email}`
    await redisClient.set(key, otpValue, {
        expiration: {
            type: "EX",
            value: expirationSeconds
        }
    });

    const templatePath = path.join(process.cwd(), "src/app/templates/forgot-password.ejs");
    const templateData = {
        name: isUserExists.name,
        otp: otpValue,
        expirationMinutes: expirationSeconds / 60
    }

    const htmlTemplate = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: isUserExists.email,
        subject: "Forgot Password",
        // text: `Your OTP is ${otp}`,
        html: htmlTemplate
    });




};

const resetPassword = async (payload : IResetPasswordPayload) => {
     const {otp, email, newPassword} = payload;
    
    const isUserExists = await prisma.user.findUnique({
        where : {
            email
        }
    });

    if(!isUserExists){
        throw new Error("User Does not Exist!")
    }
    if (isUserExists.status === "BLOCKED"){
        throw new Error("User Blocked")
    }
    if (isUserExists.isDeleted || isUserExists.status === "DELETED"){
        throw new Error ("User Deleted")
    }

    const key = `forgot-password-otp:${isUserExists.email}`

    const redisOtp = await redisClient.get(key)
    
    if (!redisOtp) {
        throw new Error ("Invalid OTP")
    }

    if (redisOtp !== otp) {
        throw new Error ("OTP Does Not Match.")
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

    const updatedUser = await prisma.user.update({
        where : {
            email : isUserExists.email
        },
        data : {
            password : hashedNewPassword,
        }
    });

    await redisClient.del([key]);

    const templatePath = path.join(process.cwd(), "src/app/templates/reset-password-success.ejs");
    const templateData = {
        name: isUserExists.name
    };

    const htmlTemplate = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: isUserExists.email,
        subject: "Password Changed",
        // text: `Your OTP is ${otp}`,
        html: htmlTemplate
    });



};



export const AuthService = {
    registerTenant,
    loginUser,
    getMe,
    refreshToken,
    forgotPassword,
    resetPassword
    
}
