import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import express from "express";
import { Lucia, TimeSpan } from "lucia";
import { verifyRequestOriginHeader, validateSession } from "./middlewares";
import routes from './routes';

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}

const port = process.env.PORT

// initialize lucia auth
const client = new PrismaClient()
const adapter = new PrismaAdapter(client.users_sessions, client.users);

export const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(30, "d"), // 30 days
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.USING_HTTPS === "true",
        }
    },
})

// initialize express js & its middlewares
const app = express()
app.use(express.static('public')); //for images public folder

app.use(express.json())

app.use(verifyRequestOriginHeader)
app.use(validateSession)

app.use('/api', routes) //routes

app.listen(port, () => {
    console.log(`listening on ${port}`)
})

