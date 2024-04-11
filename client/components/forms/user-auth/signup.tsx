'use client'

import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";

type userSignupForm = userType & { password: string }

function SignupForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<userSignupForm>()

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    function onSubmit(data: userSignupForm) {
        postAPI('/users', { username: data.username, email: data.email, password: data.password })
    }

    return (
        <div className=" flex justify-center flex-wrap gap-y-3 max-w-[33rem]">
            <Controller
                control={control}
                name="username"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        className="shadow-sm rounded-xl max-w-[33rem] "
                        type="text"
                        label="Enter Username"
                        size="lg"
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
                        className="shadow-sm rounded-xl max-w-[33rem]"
                        type="text"
                        label="Enter Email"
                        size="lg"
                        {...field}
                    />
                } />
            <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        className="shadow-sm rounded-xl max-w-[33rem]"
                        type="password"
                        label="Enter Password"
                        size="lg"
                        {...field}
                    />
                } />

            <Button
                onClick={handleSubmit(onSubmit)}
                size="lg"
            >
                Sign Up
            </Button>
        </div>
    )

}

export default SignupForm;