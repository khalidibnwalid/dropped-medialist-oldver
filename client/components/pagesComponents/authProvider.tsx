import { userFetchOptions } from "@/utils/query/userQueries"
import { useQuery } from "@tanstack/react-query"
import { createContext } from "react"
import UserAuthLayout from "../forms/userAuth/layout"
import { userType } from "@/types/user"

type context = {
    userData: userType
}

export const authContext = createContext({} as context)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const user = useQuery(userFetchOptions())
    const isLoggedin = user.isSuccess && user.data

    return isLoggedin ? (
        <authContext.Provider value={{ userData: user.data }}>
            {children}
        </authContext.Provider>
    ) : <UserAuthLayout />
}