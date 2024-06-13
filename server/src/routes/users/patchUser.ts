import { prisma } from '@/src/index';
import { Request, Response } from 'express';
import { Argon2id } from "oslo/password";
import { emailRegex } from '../../utils/regex';

type userFormReq = { username?: string, email?: string, oldPassword?: string, password?: string }
type userData = { username?: string, email?: string, hashed_password?: string }

export default async function patchUserRoute(req: Request, res: Response) {
    try {
        const bodyData = req.body as userFormReq
        const id = res.locals?.user?.id

        if (!bodyData) return res.status(400).json({ message: 'Invalid Data' })
        if (!id) return res.status(401).json({ message: 'Unauthorized' })

        let data: userData = {}

        const userExist = await prisma.users.findFirst({
            where: {
                OR: [
                    { username: bodyData.username },
                    { email: bodyData.email }
                ]
            }
        })

        const currentUser = await prisma.users.findUnique({ where: { id } })

        if (bodyData.username) {
            if (typeof bodyData.username !== 'string') return res.status(400).json({ message: 'username: Invalid username' })
            if (userExist?.username === bodyData.username)
                return res.status(400).json({ message: 'username: Username already in use' }) //will be sent to client
            data['username'] = bodyData.username
        }

        if (bodyData.email) {
            if (typeof bodyData.email !== 'string' || !emailRegex.test(bodyData.email))
                return res.status(400).json({ message: 'email: Invalid email' })
            if (userExist?.email === bodyData.email)
                return res.status(400).json({ message: 'email: Email already in use' })
            data['email'] = bodyData.email
        }

        if (bodyData.password) {
            if (!bodyData.oldPassword && typeof bodyData.oldPassword !== 'string')
                return res.status(400).json({ message: 'Old Password is Required' })

            const validOldPassword = await new Argon2id().verify(currentUser.hashed_password, bodyData.oldPassword);
            if (!validOldPassword) return res.status(400).json({ message: 'Old Password is Invalid' })

            if (typeof bodyData.password !== 'string')
                return res.status(400).json({ message: 'Invalid password' })
            const hashed_password = await new Argon2id().hash(bodyData.password)
            data['hashed_password'] = hashed_password
        }

        if (!data) return res.status(400).json({ message: 'Invalid Data' })

        const user = await prisma.users.update({ data, where: { id } })
        console.log('[Users] Edited:', id)
        res.status(200).json(user);
    } catch (e) {
        console.log("[Users]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
