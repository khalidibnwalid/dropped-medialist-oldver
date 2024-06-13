import { userFormType } from "@/pages/user";
import { Input } from "@nextui-org/react";
import { useContext } from "react";
import { Control, Controller, FieldErrors, UseFormGetValues } from "react-hook-form";
import { authContext } from "../authProvider";

export default function UserFormFields({
    control,
    errors,
    getValues,
    mutationError,
}: {
    control: Control<userFormType>,
    errors: FieldErrors<userFormType>,
    getValues: UseFormGetValues<userFormType>
    mutationError: Error | null
}) {
    const { userData } = useContext(authContext)
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    //extracting the error message from the error msg sent by the server
    const emailError = mutationError?.message.startsWith('email')
        ? mutationError?.message.replace('email: ', '') : errors?.email?.message
    const usernameError = mutationError?.message.startsWith('username')
        ? mutationError?.message.replace('username: ', '') : errors?.username?.message

    return (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 animate-fade-in">
            <div className="space-y-3">
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        validate: (value) => value !== userData.email || "New email must be different from the old one",
                        pattern: {
                            value: emailRegex,
                            message: 'Please enter a valid email',
                        }
                    }}
                    render={({ field }) =>
                        <Input
                            isInvalid={Boolean(emailError)}
                            color={emailError ? "danger" : undefined}
                            errorMessage={emailError}
                            className="shadow-sm rounded-xl"
                            type="text"
                            label="Change Email"
                            {...field}
                        />
                    } />

                <Controller
                    control={control}
                    name="username"
                    rules={{
                        validate: (value) => value !== userData.username || "New username must be different from the old one",
                    }}
                    render={({ field }) =>
                        <Input
                            isInvalid={Boolean(usernameError)}
                            color={usernameError ? "danger" : undefined}
                            errorMessage={usernameError}
                            className="shadow-sm rounded-xl"
                            type="text"
                            label="Change Username"
                            {...field}
                        />
                    } />
            </div>

            <div className="space-y-3">
                <Controller
                    control={control}
                    name="oldPassword"
                    render={({ field }) =>
                        <Input
                            isInvalid={errors.oldPassword && true}
                            color={errors.oldPassword && "danger"}
                            errorMessage={errors?.oldPassword?.message}
                            className="shadow-sm rounded-xl"
                            type="password"
                            label="Your Old Password"
                            {...field}
                        />
                    } />

                <Controller
                    control={control}
                    name="newPassword"
                    rules={{
                        validate: (value) => {
                            if (!getValues('oldPassword') && !value) return true //should not validate if both are empty
                            if (!getValues('oldPassword')) return "Old password is required to change it"
                            if (value === getValues('oldPassword')) return "New password must be different from the old one"
                            return true
                        },
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    }}
                    render={({ field }) =>
                        <Input
                            isInvalid={errors.newPassword && true}
                            color={errors.newPassword && "danger"}
                            errorMessage={errors?.newPassword?.message}
                            className="shadow-sm rounded-xl"
                            type="password"
                            label="Your New Password"
                            {...field}
                        />
                    } />

                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        validate: (value) => value === getValues('newPassword') || "Passwords do not match",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    }}
                    render={({ field }) =>
                        <Input
                            isInvalid={errors.confirmPassword && true}
                            color={errors.confirmPassword && "danger"}
                            errorMessage={errors?.confirmPassword?.message}
                            className="shadow-sm rounded-xl"
                            type="password"
                            label="Confirm Your New Password"
                            {...field}
                        />
                    } />
            </div>
        </div>
    )
}