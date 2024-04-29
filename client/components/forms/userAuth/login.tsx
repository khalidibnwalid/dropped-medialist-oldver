import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { mutateUserCache } from "@/utils/query/cacheMutation";
import { Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import SubmitButtonWithIndicators from "../_components/SubmitWithIndicators";

type userLoginForm = userType & { password: string }

function LoginForm() {
    const { handleSubmit, formState: { errors }, control } = useForm<userLoginForm>()

    const mutation = useMutation({
        mutationFn: (data: Partial<userLoginForm>) => postAPI('sessions', data),
        onSuccess: (data) => mutateUserCache(data),
    })

    function onSubmit(data: userLoginForm) {
        const formData = { username: data.username.trim(), password: data.password }
        mutation.mutate(formData)
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

            {mutation.isError && <label className="text-red-500 w-full text-center">{mutation.error.message}</label>}

            <SubmitButtonWithIndicators
                mutation={mutation}
                onClick={handleSubmit(onSubmit)}
                saveContent="Login"
                savedContent="Logged In"
                type="submit"
                size="lg"
            />

        </form>
    )

}

export default LoginForm;