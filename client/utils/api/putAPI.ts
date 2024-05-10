/** Accepts JSON and FormData */
export default async function putAPI(
    params: string,
    data: object | FormData,
    props?: RequestInit
) {
    const isFormData = typeof data === 'object' && data instanceof FormData
    const body = isFormData ? data : JSON.stringify(data)

    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'PUT',
            headers: !isFormData ? {
                'Content-Type': 'application/json'
            } : undefined,
            body,
            credentials: 'include',
            ...props
        })

        const jsonRes = await res.json();

        if (!res.ok) {
            throw new Error(jsonRes.message as string || 'Failed to Change Data')
        }
        return jsonRes

    } catch (e) {
        console.error(e)
        throw new Error((e as Error).message || 'Failed to Change Data')
    }
}