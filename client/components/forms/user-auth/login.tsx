'use client'

import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";

type userLoginForm = userType & { password: string }

function LoginForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<userLoginForm>()

    function onSubmit(data: userLoginForm) {
        postAPI('/sessions', { username: data.username, password: data.password })
    }

    return (
        <div className=" flex justify-center flex-wrap gap-y-3 max-w-[33rem]">
            <Controller
                control={control}
                name="username"
                rules={{ required: true }}
                render={({ field }) =>
                    <Input
                        className="shadow-sm rounded-xl max-w-[33rem]"
                        type="text"
                        label="Enter Email or Username"
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
                Login
            </Button>
        </div>
    )

}

export default LoginForm;