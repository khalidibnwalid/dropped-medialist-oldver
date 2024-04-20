import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Argon2id } from "oslo/password";
import { lucia } from '..';
import { emailRegex } from '../utils/regex';

const prisma = new PrismaClient()
const usersRouter = express.Router();

//general info for user

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
        const userExist = await prisma.users.findFirst({ where: { OR: [{ email }, { username }] } });

        // need protection against brute-force attacks and login throttling.
        if (userExist) {
            if (userExist.email === email) {
                return res.status(400).json({ message: 'Email already in use' });
            } else if (userExist.username === username) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        }

        const hashed_password = await new Argon2id().hash(password);
        const userId = crypto.randomUUID()

        await prisma.users.create({
            data: {
                id: userId,
                username,
                email,
                hashed_password,
            }
        })

        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id).serialize()

        res
            .appendHeader("Set-Cookie", sessionCookie)
            .status(201)
            .json({ message: 'User Added' });

        console.log(`[ID: ${userId}] [Users - POST] added `)

    } catch (e) {
        console.log("[Users - POST] Error:", e)
        res.status(500).json({ message: 'error' })
    }
})

// # GET - currently returns all users, just for testing 
// it should: if (session) return full data; else return general data  
//(or always return general data since the data isn't even that big)
usersRouter.get('/:user_id?', async (req, res) => {
    const id = req.params.user_id

    try {
        if (id) {
            const user = await prisma.users.findUnique({
                where: { id }
            })
            res.status(200).json(user);
        } else {
            const users = await prisma.users.findMany()
            res.status(200).json(users);
        }

    } catch (e) {
        console.log("[Users]", e)
        res.status(500).json({ message: 'error' })
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
//         res.status(500).json({ message: 'error' })
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
//         res.status(500).json({ message: 'error' })
//     }
// })

export default usersRouter;
