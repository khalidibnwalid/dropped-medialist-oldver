"use server"

import "dotenv/config";
import axios from "axios";

export default async function deleteAPI(params: string, data: object) {
  try {
    await axios.delete(`${process.env.API_URL}/${params}`, {
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (e) {
    console.error(e)
    throw new Error('Failed to Delete Data')

  }
  // [async & await]
  //don't forget to make the functions 'async' 
  //don't forget the "await" when importing: const data = await ()
}