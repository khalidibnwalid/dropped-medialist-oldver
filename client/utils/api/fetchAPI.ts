"use client"

export default async function fetchAPI(params: string) {
  try {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, { 
      cache: 'no-store',
      credentials: 'include'
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