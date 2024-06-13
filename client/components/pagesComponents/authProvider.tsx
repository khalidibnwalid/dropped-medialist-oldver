import { userType } from "@/types/user"
import { userFetchOptions } from "@/utils/query/userQueries"
import { Button } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import router from "next/router"
import { createContext } from "react"
import { BiRevision, BiXCircle } from "react-icons/bi"
import UserAuthLayout from "../forms/userAuth/layout"

type context = {
    userData: userType
}

export const authContext = createContext({} as context)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: userData, isSuccess } = useQuery(userFetchOptions())
    const isLoggedin = isSuccess && userData

    return isLoggedin ? (
        <authContext.Provider value={{ userData }}>
            {children}
        </authContext.Provider>
    ) : <UserAuthLayout />
}