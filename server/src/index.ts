import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import express from "express";
import { Lucia } from "lucia";
import routes from './routes';

const port = process.env.PORT;

// initialize lucia auth
const client = new PrismaClient();
const adapter = new PrismaAdapter(client.users_sessions, client.users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}

// initialize express js
const app = express();

app.use(express.json()); //parser
app.use(express.static('public')); //for images public folder

app.use('/api', routes);

app.listen(port, () => {
    console.log(`listening on ${port}`, '')
});

