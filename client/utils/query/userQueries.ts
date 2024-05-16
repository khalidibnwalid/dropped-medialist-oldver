import { userType } from '@/types/user'
import { queryOptions } from '@tanstack/react-query'
import fetchAPI from '../api/fetchAPI'
import { queryClient } from '@/components/pagesComponents/providers'

/** user data 
 * @example Key: ['user']
*/
export const userFetchOptions = () => queryOptions<userType>({
    queryKey: ['user'],
    queryFn: () => fetchAPI(`user`),
    retry: 3,
})

/** Edit userData's Cache */
export const mutateUserCache = (data: Partial<userType>) => {
    queryClient.setQueryData(['user'], (oldData: userType) => ({ ...oldData, ...data }));
};