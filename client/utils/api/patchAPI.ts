export default async function patchAPI(params: string, data: object[] | object) {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/${params}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        })

        if (!res.ok) {
            throw new Error('Failed to Add Data')
        }

        return res.json()    
    
    } catch (e) {
        console.error(e)
        throw new Error('Failed to Change Data')

    }
    // [async & await]
    //don't forget to make the functions 'async' 
    //don't forget the "await" when importing: const data = await ()
}