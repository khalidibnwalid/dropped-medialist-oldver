"use server"

import { headers } from "next/headers";

export default async function serverFetchAPI(params: string) {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            headers: headers(),
        })

        if (!res.ok) {
            throw new Error('Failed to Get Data From The Database');
        }
        return res.json();
    } catch (e) {
        console.error(e)
        throw new Error('Failed to Get Data From The Database')

    }
    // [async & await]
    //don't forget to make the functions 'async' 
    //don't forget the "await" when importing: const data = await ()
}