import { prisma } from '@/src/index';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import { Argon2id } from "oslo/password";
import { lucia } from '..';
import { emailRegex } from '../utils/regex';
import userMediaRoot from '../utils/userMediaRoot';

const usersRouter = express.Router();

// # POST - Sign Up
usersRouter.post('/', async (req, res) => {

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
})

// # GET - general info only
usersRouter.get('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        const user = await prisma.users.findUnique({
            where: { id: user_id }
        })

        const { hashed_password, ...userData } = user
        res.status(200).json(userData)
    } catch (e) {
        console.log("[Users]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// // # DELETE
// router.delete('/', async (req, res) => {
//     const { body }: { body: string[] /* items.id[] */ } = req.body;
// need session check

//     // should remove the deleted items from other items' related column varchar[]
//     try {
//         await prisma.users.deleteMany({
//             where: { id: { in: body } }
//         })
//         console.log('[Users] Deleted:', body)
//         res.status(200).json({});
//     } catch (e) {
//         console.log("[Users]", e)
//         res.status(500).json({ message: 'Internal Server Error' })
//     }
// })

// ## PATCH, change the values for group of items
// usersRouter.patch('/:user_id', async (req, res) => {
//     const id = req.params.user_id
//     const data = req.body;
//     // need session check

//     try {
//         await prisma.users.updateMany({
//             data,
//             where: { id }
//         })
//         console.log('[Users] Edited:', id)
//         res.status(200).json({});
//     } catch (e) {
//         console.log("[Users]", e)
//         res.status(500).json({ message: 'Internal Server Error' })
//     }
// })

export default usersRouter;
