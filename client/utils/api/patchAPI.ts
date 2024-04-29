export default async function patchAPI(params: string, data: object[] | object, props?: RequestInit) {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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