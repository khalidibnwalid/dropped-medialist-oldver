import { prisma } from '@/src/index';
import 'dotenv/config';
import express from 'express';
import patchUserRoute from './patchUser';
import postUserRoute from './postUser';

const usersRouter = express.Router();

usersRouter.post('/', postUserRoute) // POST - Sign Up
usersRouter.patch('/', patchUserRoute) // PATCH - Edit User

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
// })

export default usersRouter;
