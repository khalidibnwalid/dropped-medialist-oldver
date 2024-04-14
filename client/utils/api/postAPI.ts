"use server"
import axios from "axios";
import "dotenv/config";
import { cookies } from "next/headers";

export default async function postAPI(params: string, data?: object) {
    try {
        const res = await axios.post(`${process.env.API_URL}/${params}`, data, { withCredentials: true })
        const cookiesHeader = res.headers['set-cookie']

        //temporary solution for dev, since this is a server side function, it can't give the cookies to the client
        if (cookiesHeader) {
            cookiesHeader.forEach((cookie: string) => {
                if (cookie.startsWith('auth_session')) {
                    const session = cookie.slice(13, 53);
                    cookies().set('auth_session', session)
                }
            })
        }

    } catch (e) {
        console.error(e)
        throw new Error('Failed to Add Data')

    }
}