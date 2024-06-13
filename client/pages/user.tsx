import TitleBar from "@/components/bars/titlebar";
import SubmitButtonWithIndicators from "@/components/forms/_components/SubmitWithIndicators";
import { authContext } from "@/components/pagesComponents/authProvider";
import UserFormFields from "@/components/pagesComponents/user/userFormFields";
import { userType } from "@/types/user";
import patchAPI from "@/utils/api/patchAPI";
import { mutateUserCache } from "@/utils/query/userQueries";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { RiUserLine } from "react-icons/ri";

export type userFormType = Pick<userType, 'username' | 'email'> & {
    newPassword?: string,
    confirmPassword?: string,
    oldPassword?: string,
}

export default function UserPage() {
    const { userData } = useContext(authContext)
    const { handleSubmit, control, formState: { errors }, getValues, setValue } = useForm<userFormType>();

    const userMutate = useMutation({
        mutationFn: (data: userFormType) => patchAPI('user', data),
        onSuccess: (data) => {
            mutateUserCache(data)

            // reset() is glitching, so I'm resetting them manually
            setValue('oldPassword', '')
            setValue('newPassword', '')
            setValue('confirmPassword', '')
            setValue('email', '')
            setValue('username', '')
        },
    })

    async function onSubmit(data: userFormType) {
        if (!data.username && !data.email && !data.newPassword) return

        const userData = {
            username: data?.username?.trim(),
            email: data?.email?.trim(),
            oldPassword: data?.oldPassword,
            password: data?.newPassword
        }
        userMutate.mutate(userData)
    }

    return (
        <>
            <Head>
                <title>Medialist - {userData.username}</title>
            </Head>

            <div>
                <TitleBar
                    startContent={<RiUserLine className="text-[30px] mr-3 flex-none " />}
                    title={'Edit User: ' + userData.username}
                    pointedBg
                    withButtons
                >
                    <SubmitButtonWithIndicators
                        mutation={userMutate}
                        saveContent={<><FaSave /> Save</>}
                        onClick={handleSubmit(onSubmit)}
                        saveOnClick={handleSubmit(onSubmit)}
                    />
                    {userData.roles === 'admin' &&
                        <Button>
                            Dashboard
                        </Button>
                    }
                </TitleBar>

                <UserFormFields
                    control={control}
                    errors={errors}
                    mutationError={userMutate.error}
                    getValues={getValues}
                />
            </div>
        </>
    )
}