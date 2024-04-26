export default async function deleteAPI(params: string, data?: object) {
  try {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
  })

  if (!res.ok) {
      throw new Error('Failed to Add Data')
  }

  console.log(res)
  return res.json()

  } catch (e) {
    console.error(e)
    throw new Error('Failed to Delete Data')

  }
  // [async & await]
  //don't forget to make the functions 'async' 
  //don't forget the "await" when importing: const data = await ()
}