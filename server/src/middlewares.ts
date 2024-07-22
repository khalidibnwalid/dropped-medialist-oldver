import 'dotenv/config';
import { NextFunction, Request, Response } from "express";
import type { User, Session } from "lucia";
import { verifyRequestOrigin } from "lucia";
import { lucia } from ".";

declare global {
    namespace Express {
        interface Locals {
            user: User | null;
            session: Session | null;
        }
    }
}

// basic CSRF
export const verifyRequestOriginHeader = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next() // skip origin check in development

    const originWhiteList = process.env.ORIGIN_WHITELIST?.split(",") || []
    if (originWhiteList.length === 0) {
        console.log("[ERROR]: ORIGIN_WHITELIST is undefined or empty. Please set it in your .env/docker-compose.yml file.")
        return res.status(500).json({ message: 'Internal Server Error' })
    }

    if (req.method === "GET") return next()

    const originHeader = req.headers.origin ?? null
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = req.headers.host ?? null

    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader, ...originWhiteList])) {
        return res.status(403).end()
    }

    return next()
}

export const validateSession = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "")
    if (!sessionId) {
        res.locals.user = null
        res.locals.session = null
        return next()
    }

    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
    }
    if (!session) {
        res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    }
    res.locals.user = user;
    res.locals.session = session;

    return next();
}


