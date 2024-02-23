"use server"

import "dotenv/config";
import axios from "axios";

export default async function patchAPI(params: string, data: object[] | object) {
    try {
        const res = await axios.patch(`${process.env.API_URL}/${params}`, data);
    } catch (e) {
        console.error(e)
        throw new Error('Failed to Change Data')
    
      }
    // [async & await]
    //don't forget to make the functions 'async' 
    //don't forget the "await" when importing: const data = await ()
}