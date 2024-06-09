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
    const { data: userData, isSuccess, isError, isRefetchError } = useQuery(userFetchOptions())
    const isLoggedin = isSuccess && userData

    if (isError || isRefetchError) return (
        <div className="w-full h-screen flex flex-col gap-y-3 items-center justify-center">
            <BiXCircle className="text-danger text-8xl" />
            <p className="text-center text-danger text-3xl">Failed to Fetch User Data</p>
            <p className="text-center text-neutral-400 text-lg ont-semibold">Check Your Connection or Your Server</p>
            <Button
                variant='ghost'
                color='primary'
                size="lg"
                onClick={() => router.reload()}
            >
                <BiRevision className=" text-xl" />
                Try again
            </Button>
        </div>
    )

    return isLoggedin ? (
        <authContext.Provider value={{ userData }}>
            {children}
        </authContext.Provider>
    ) : <UserAuthLayout />
}