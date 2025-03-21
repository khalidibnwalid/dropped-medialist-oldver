import { userType } from "@/types/user";
import postAPI from "@/utils/api/postAPI";
import { mutateUserCache } from "@/utils/query/userQueries";
import { Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import SubmitButtonWithIndicators from "../_components/SubmitWithIndicators";

type userSignupForm = userType & { password: string }

function SignupForm() {
    const { handleSubmit, formState: { errors }, control } = useForm<userSignupForm>()

    const mutation = useMutation({
        mutationFn: (data: Partial<userSignupForm>) => postAPI('user', data),
        onSuccess: (data) => mutateUserCache(data),
    })

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    function onSubmit(data: userSignupForm) {
        const formData = { username: data.username.trim(), email: data.email.trim(), password: data.password }
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

            {mutation.isError && <label className="text-red-500 w-full text-center">{mutation.error.message}</label>}

            <SubmitButtonWithIndicators
                mutation={mutation}
                onClick={handleSubmit(onSubmit)}
                saveContent="Sign Up"
                savedContent="Signed Up!"
                type="submit"
                size="lg"
            />

        </form>
    )
}

export default SignupForm;