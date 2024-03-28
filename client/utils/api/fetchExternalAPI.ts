"use client"
import "dotenv/config";

export default async function fetchExternalAPI(link: string) {
  try {
    const res = await fetch(link, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error('Failed to Get Data');
    }
    return res.json();
  } catch (e) {
    console.error(e)
    throw new Error('Failed to Get Data')

  }
  // [async & await]
  //don't forget to make the functions 'async' 
  //don't forget the "await" when importing: const data = await ()
}