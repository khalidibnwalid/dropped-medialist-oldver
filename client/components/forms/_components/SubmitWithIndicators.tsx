import { Button, ButtonProps, Spinner } from "@nextui-org/react"
import { UseMutationResult } from "@tanstack/react-query"
import { MouseEventHandler } from "react"
import { BiCheckDouble, BiRevision } from "react-icons/bi"
import { FaSave } from "react-icons/fa"

/** Submit Button With Indicators for Error and Success */
export default function SubmitButtonWithIndicators<TData = unknown, TError = unknown>({
    mutation,
    onClick,
    saveOnClick,
    saveContent = <><FaSave className="text-xl" /> Save</>,
    savedContent = <><BiCheckDouble className="text-xl" /> Saved</>,
    errorContent = <><BiRevision className="text-xl" />Try Again</>,
    className,
    type = "button",
    variant = "solid",
    size,
    isIconOnly,
    isDisabled,
}: {
    mutation: UseMutationResult<any, TError, TData, unknown>,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    saveOnClick?: MouseEventHandler<HTMLButtonElement>,
    saveContent?: JSX.Element | string,
    savedContent?: JSX.Element | string,
    errorContent?: JSX.Element | string,
    className?: string
    type?: 'button' | 'submit' | 'reset',
    variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost",
    size?: "sm" | "md" | "lg",
    isIconOnly?: boolean
    isDisabled?: boolean
}) {
    const buttonProps: ButtonProps = {
        className,
        variant,
        type,
        size,
        isIconOnly,
    }

    if (mutation.isError)
        return <Button
            color="danger"
            onClick={onClick}
            isDisabled={isDisabled}
            {...buttonProps}
        >
            {errorContent}
        </Button>

    if (mutation.isSuccess)
        return <Button
            color='success'
            onClick={saveOnClick}
            isDisabled={isDisabled}
            {...buttonProps}
        >
            {savedContent}
        </Button>

    if (mutation.isPending)
        return <Button
            disabled={true}
            {...buttonProps}
        >
            <Spinner size={size === "sm" ? "sm" : "md"} />
        </Button>

    return <Button
        onClick={onClick}
        isDisabled={isDisabled}
        {...buttonProps}
    >
        {saveContent}
    </Button>
}
