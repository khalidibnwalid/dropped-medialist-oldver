export default async function postAPI(
    params: string,
    data?: object | FormData,
    props?: RequestInit
) {
    const isFormData = typeof data === 'object' && data instanceof FormData
    // const isJSON = typeof data === 'object'

    const body = data
        ? (isFormData ? data : JSON.stringify(data))
        : undefined

    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'POST',
            headers: !isFormData ? {
                'Content-Type': 'application/json'
            } : undefined,
            body,
            credentials: 'include',
            ...props
        })

        const jsonRes = await res.json();

        if (!res.ok) {
            throw new Error(jsonRes.message as string || 'Failed to Add Data')
        }
        return jsonRes

    } catch (e) {
        console.error(e)
        throw new Error((e as Error).message || 'Failed to Add Data')
    }
}