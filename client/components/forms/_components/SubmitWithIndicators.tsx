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
    className = "bg-accented",
    type = "button",
    variant = "solid",
    size,
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
}) {

    const buttonProps: ButtonProps = {
        variant,
        type,
        size,
    }

    if (mutation.isPending)
        return <Button className={className} {...buttonProps}>
            <Spinner size={size} />
        </Button>

    if (mutation.isError)
        return <Button color="danger" onClick={onClick} {...buttonProps}>
            {errorContent}
        </Button>

    if (mutation.isSuccess)
        return <Button
            className="focus:outline-none"
            color='success'
            onClick={saveOnClick}
            {...buttonProps}
        >
            {savedContent}
        </Button>

    return <Button
        className={className}
        onClick={onClick}
        {...buttonProps}
    >
        {saveContent}
    </Button>
}
