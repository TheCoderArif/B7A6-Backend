import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import config from "../config";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where : {
                role : Role.ADMIN
            }
        });

        if(isSuperAdminExist){
            console.log("Admin Already Exists!!");
            return;
        }

        const name = config.admin_name
        const email = config.admin_email
        const password = config.admin_password

        if (!name || !email || !password){
            throw new Error ("Admin name or email or password missing in env file!!")
        }

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

        const admin = await prisma.user.create({
            data : {
            name,
            email,
            password : hashedPassword,
            role : Role.ADMIN,
            needPasswordChange: false,
            emailVerified: true
        }
        });

        console.log("Admin Created");
    } catch (error) {
        console.log("Error Seeding Admin: ", error);
        await prisma.user.delete({
            where : {
                email : config.admin_email
            }
        });
    }
};