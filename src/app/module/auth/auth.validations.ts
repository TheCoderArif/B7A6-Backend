import z, { email } from 'zod'


const TenantRegisterZodSchema = z.object({
    name : z.string(),
    email : z.email(),
    password : z .string()
                .min(8, { message: 'Password must be at least 8 characters long' })
                .max(32, { message: 'Password cannot exceed 32 characters' })
                .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
                .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
                .regex(/[0-9]/, { message: 'Must contain at least one number' })
                .regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character' }),
    tenant : z.object({
        contactNumber : z.string().optional()
    }).optional()
    
});

const ForgotPasswordZodSchema =  z.object({
   
    email : z.email()
});

const ResetPasswordZodSchema = z.object({
   
    email : z.email(),
    newPassword : z .string()
                .min(8, { message: 'Password must be at least 8 characters long' })
                .max(32, { message: 'Password cannot exceed 32 characters' })
                .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
                .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
                .regex(/[0-9]/, { message: 'Must contain at least one number' })
                .regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character' }),
                otp: z.string().length(6),
});


export const UserValidations = {
    TenantRegisterZodSchema,
    ForgotPasswordZodSchema,
    ResetPasswordZodSchema
}