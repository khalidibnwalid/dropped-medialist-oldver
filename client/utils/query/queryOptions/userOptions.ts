import { userType } from '@/types/user'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../../api/fetchAPI'

/** user data 
 * @example Key: ['user']
*/
export const userFetchOptions = () => queryOptions<userType>({
    queryKey: ['user'],
    queryFn: () => fetchAPI(`user`),
    retry: 3,
})

