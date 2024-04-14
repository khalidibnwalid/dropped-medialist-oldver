'use client'

import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Controller, set, useForm } from "react-hook-form";
import { useState } from "react";

type userLoginForm = userType & { password: string }

function LoginForm() {
    const { handleSubmit, formState: { errors }, control } = useForm<userLoginForm>()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(data: userLoginForm) {
        setIsLoading(true)
        try {
            console.log(data);
            // I trim the username, since a user can copy and paste their emails with spaces
            await postAPI('sessions', { username: data.username.trim(), password: data.password })
            if (error) setError('')
            router.refresh()
        } catch (e) {
            console.log(e);
            setError('Failed to login. Please try again')
        }
        setIsLoading(false)
    }

    return (
        <form className=" flex justify-center flex-wrap gap-y-3">
            <Controller
                control={control}
                name="username"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.username && true}
                        color={errors.username && "danger"}
                        errorMessage={errors.username?.message}
                        className="shadow-sm rounded-xl max-w-[30rem] "
                        type="text"
                        label="Email or Username"
                        {...field}
                    />
                } />
            <Controller
                control={control}
                name="password"
                rules={{
                    required: true,
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.password && true}
                        color={errors.password && "danger"}
                        errorMessage={errors.password?.message}
                        className="shadow-sm rounded-xl max-w-[30rem] "
                        type="password"
                        label="Password"
                        {...field}
                    />
                } />

            {error && <label className="text-red-500 w-full text-center">{error}</label>}
            
            <Button
                onClick={handleSubmit(onSubmit)}
                isDisabled={isLoading}
                color={error && !isLoading ? "danger" : 'default'}
                type="submit"
                size="lg"
            >
                {isLoading && <Spinner size="sm" />}
                {!isLoading && !error && "Login"}
                {!isLoading && error && "Try Again"}
            </Button>
        </form>
    )

}

export default LoginForm;