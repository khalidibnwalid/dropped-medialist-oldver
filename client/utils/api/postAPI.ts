"use server"
import "dotenv/config";
import axios from "axios";

export default async function postAPI(params: string, data: object) {
    try {
        const res = await axios.post(`${process.env.API_URL}/${params}`, data);
    } catch (e) {
        console.error(e)
        throw new Error('Failed to Add Data')

    } 
    // [async & await]
    //don't forget to make the functions 'async' 
    //don't forget the "await" when importing: const data = await ()
}