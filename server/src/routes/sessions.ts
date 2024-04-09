import { PrismaClient } from '@prisma/client';
import express from 'express';
import { lucia } from '../index';

const prisma = new PrismaClient()
const sessionsRoutes = express.Router();

// # POST
sessionsRoutes.post('/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    //need Login Logic

    try {
        const session = await lucia.createSession(user_id, {})
        const sessionCookie = lucia.createSessionCookie(session.id).serialize()

        res
            .appendHeader("Set-Cookie", sessionCookie)
            .status(201)
            .send('OK');

        console.log(`[ID: ${user_id}] [Sessions - POST] added `)
    } catch (e) {
        console.log(`ُ[ID: ${user_id}] [Sessions - POST] Error:`, e.message)
        res.status(500).send('session creation error')
    }
})

// # GET
sessionsRoutes.get('/', async (req, res) => {
    try {
        const user = res.locals.user

        if (!user || !res.locals.session) return res.status(401).send('Unauthorized')

        const sessions = await lucia.getUserSessions(user.id);
        res.status(200).json(sessions);

    } catch (e) {
        console.log("[Sessions - GET] Error:", e.message)
        res.status(500).send('sessions GET error')
    }
})


// # DELETE
sessionsRoutes.delete('/:session_id?', async (req, res) => {

    const providedSessionId = req.params.session_id
    const currentSessionId = res.locals.session?.id

    try {
        await lucia.invalidateSession(providedSessionId || currentSessionId);
        if (!providedSessionId && currentSessionId) res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())

        console.log(`ُ[ID: ${res.locals.user.id}] [Sessions- Delete] Deleted`)
        res.status(200).send('OK');
    } catch (e) {
        console.log(`ُ[ID: ${res.locals.user.id}] [Sessions - Delete] Error:`, e)
        res.status(500).send('error')
    }
})

export default sessionsRoutes;
