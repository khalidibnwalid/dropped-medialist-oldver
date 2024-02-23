'use client'
import { VisuallyHidden, cn, useRadio } from "@nextui-org/react";

export default function BoxRadio(props: any) {
    const {
        Component,
        children,
        isSelected,
        getBaseProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
    } = useRadio(props);

    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "group inline-flex opacity-80 hover:opacity-100 duration-200 active:opacity-50 justify-between tap-highlight-transparent",
                "w-[150px] h-[135px] cursor-pointer border-3 border-default rounded-lg",
                "data-[selected=true]:border-primary data-[selected=true]:opacity-100",
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div {...getLabelWrapperProps()}>
                {children && <span {...getLabelProps()}>{children}</span>}
            </div>
        </Component>
    );
};