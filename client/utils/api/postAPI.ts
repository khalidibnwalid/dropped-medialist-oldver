'use client'

export default async function postAPI(params: string, data?: object) {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
            credentials: 'include',
        })

        if (!res.ok) {
            throw new Error('Failed to Add Data')
        }

        return res.json()

    } catch (e) {
        console.error(e)
        throw new Error('Failed to Add Data')

    }
}