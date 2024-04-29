export default async function fetchAPI(params: string, props?: RequestInit) {
  try {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
      cache: 'no-store',
      credentials: 'include',
      ...props
    })

    const jsonRes = await res.json();

    if (!res.ok) {
      throw new Error(jsonRes.message as string || 'Failed to Get Data')
    }
    return jsonRes

  } catch (e) {
    console.error(e)
    throw new Error((e as Error).message || 'Failed to Get Data')
  }
}
