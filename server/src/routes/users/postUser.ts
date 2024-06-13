import { prisma } from '@/src/index';
import 'dotenv/config';
import { Request, Response } from 'express';
import fs from 'fs';
import { Argon2id } from "oslo/password";
import { lucia } from '../..';
import { emailRegex } from '../../utils/regex';
import userMediaRoot from '../../utils/userMediaRoot';

export default async function postUserRoute(req: Request, res: Response) {
    //need auth check from the client to send the request
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;

    if (!password || !username || !email
        || typeof (username) !== 'string' || typeof (password) !== 'string' || typeof (email) !== 'string'
        || !emailRegex.test(email)
    )
        return res.status(400).json({ message: 'wrong data' })

    try {
        const userExist = await prisma.users.findFirst({
            where:
                { OR: [{ email }, { username }] }
        });

        // need protection against brute-force attacks and login throttling.
        if (userExist) {
            if (userExist.email === email)
                return res.status(400).json({ message: 'Email already in use' });
            if (userExist.username === username)
                return res.status(400).json({ message: 'Username already in use' });
        }

        const hashed_password = await new Argon2id().hash(password);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                hashed_password,
            }
        })

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id).serialize()

        // create media folder for the user
        const rootFolder = userMediaRoot(user.id)
        await fs.promises.mkdir(rootFolder, { recursive: true })

        res
            .appendHeader("Set-Cookie", sessionCookie)
            .status(201)
            .json(user);

        console.log(`[ID: ${user.id}] [Users - POST] added `)

    } catch (e) {
        console.log("[Users - POST] Error:", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
