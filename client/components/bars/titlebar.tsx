import { ButtonGroup } from "@nextui-org/react";

function TitleBar({
    title,
    children,
    className,
    startContent,
    pointedBg, // to be removed
    titleFlexNone,
    withButtons,
    noShadow
}: {
    title?: string,
    children?: React.ReactNode,
    className?: string,
    startContent?: React.ReactNode,
    pointedBg?: boolean,
    withButtons?: boolean,
    titleFlexNone?: boolean,
    noShadow?: boolean,
}) {
    return (
        <header className={`${className || 'p-5 my-5'}
                            flex items-center lg:justify-center flex-wrap gap-y-3 rounded-2xl
                            text capitalize font-extrabold bg-left
                             ${noShadow ? '' : 'shadow-lg'}
                             ${pointedBg ? `
                                bg-pure-theme
                                bg-pointed
                                light:bg-[radial-gradient(#ffffff33_1px,#ffffff10_1px)]
                                bg-[size:25px_25px]
                                ` : ''}
                           `}
        >
            {startContent}
            <h1 className={`text-lg ${titleFlexNone ? 'flex-none' : 'flex-grow'} `}>
                {title}
            </h1>

            {withButtons
                ? <ButtonGroup className=" flex-none shadow-lg rounded-2xl capitalize font-bold">
                    {children}
                </ButtonGroup>
                : <div className=" flex-none shadow-lg rounded-2xl">{children}</div>
            }

        </header>
    );
}




export default TitleBar;