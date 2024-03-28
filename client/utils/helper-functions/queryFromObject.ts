
/** turn an Object into a query with the name of its key and the value of its object[key] */
export const queryFromObject = (data: object, symbol: string = '&') => {
    let query = ''
    let counter = 0
    for (let key in data) {
        if (!data[key as keyof typeof data]) continue //ignore empty values
        if (counter !== 0) query += symbol
        query = query + key + data[key as keyof typeof data]
        counter++
    }
    return query as string
}