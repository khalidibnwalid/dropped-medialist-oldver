export default async function postAPI(params: string, data?: object, props?: RequestInit) {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
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