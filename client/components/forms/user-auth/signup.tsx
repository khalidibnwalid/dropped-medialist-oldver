'use client'

import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, set, useForm } from "react-hook-form";

type userSignupForm = userType & { password: string }

function SignupForm() {
    const { handleSubmit, formState: { errors }, control } = useForm<userSignupForm>()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    async function onSubmit(data: userSignupForm) {
        setIsLoading(true)
        try {
            await postAPI('users', { username: data.username.trim(), email: data.email.trim(), password: data.password })
            if (error) setError('')
            router.refresh()
        } catch (e) {
            console.log(e);
            setError('Failed to Sign Up. Try again')
        }
        setIsLoading(false)
    }

    return (
        <form className=" flex justify-center flex-wrap gap-y-3 max-w-[30rem]">
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
                        label="Username"
                        {...field}
                    />
                } />
            <Controller
                control={control}
                name="email"
                rules={{
                    required: true, pattern: {
                        value: emailRegex,
                        message: 'Please enter a valid email',

                    }
                }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.email && true}
                        color={errors.email && "danger"}
                        errorMessage={errors.email?.message}
                        className="shadow-sm rounded-xl max-w-[30rem]"
                        type="text"
                        label="Email"
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
                        className="shadow-sm rounded-xl max-w-[30rem]"
                        type="password"
                        label=" Password"
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
                {!isLoading && !error && "Sign Up"}
                {!isLoading && error && "Try Again"}
            </Button>
        </form>
    )

}

export default SignupForm;