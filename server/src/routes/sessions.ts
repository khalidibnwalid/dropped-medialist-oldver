import { prisma } from '@/src/index';
import express from 'express';
import { Argon2id } from 'oslo/password';
import { lucia } from '../index';

const sessionsRoutes = express.Router();

// # POST - LOGIN
sessionsRoutes.post('/', async (req, res) => {
    const username = req.body.username; // email or username
    const password = req.body.password;

    if (!password || !username || typeof (username) !== 'string' || typeof (password) !== 'string')
        return res.status(400).json({ message: 'Missing Data' })

    try {

        const user = await prisma.users.findFirst({
            where: {
                OR: [{ email: username }, { username }]
            }
        })
        if (!user) return res.status(401).json({ message: 'Wrong Username/Email or Password' })

        const validPassword = await new Argon2id().verify(user.hashed_password, password);
        if (!validPassword) return res.status(401).json({ message: 'Wrong Username/Email or Password' })

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id).serialize()
        res
            .appendHeader("Set-Cookie", sessionCookie)
            .status(201)
            .json({ message: 'logged in' })

        console.log(`[ID: ${user.id}] [Sessions - POST] logged in `)

    } catch (e) {
        console.log(`ُ[Sessions - POST] Error:`, e.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # GET
sessionsRoutes.get('/', async (req, res) => {
    try {
        const userId = res.locals?.user?.id
        if (!userId || !res.locals.session) return res.status(401).json({ message: 'Unauthorized' })

        const sessions = await lucia.getUserSessions(userId);
        res.status(200).json(sessions);

    } catch (e) {
        console.log("[Sessions - GET] Error:", e.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// # DELETE - LOGOUT
sessionsRoutes.delete('/:session_id?', async (req, res) => {

    const providedSessionId = req.params.session_id
    const currentSessionId = res.locals.session?.id

    try {
        await lucia.invalidateSession(providedSessionId || currentSessionId);
        if (!providedSessionId && currentSessionId) res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())

        console.log(`ُ[ID: ${res.locals.user.id}] [Sessions- Delete] Deleted`)
        res.status(200).json({ message: 'logged out' });
    } catch (e) {
        console.log(`ُ[ID: ${res.locals.user.id}] [Sessions - Delete] Error:`, e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default sessionsRoutes;
