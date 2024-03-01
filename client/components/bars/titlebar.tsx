'use client'

import { ButtonGroup } from "@nextui-org/react";

type parms = {
    title?: string;
    children?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    addAction?: void;
    starShowerBlack?: boolean;
    edgeOrange?: boolean;
    edgeBlue?: boolean;
    withButtons?: boolean;
    titleFlexNone?: boolean;
    noShadow?: boolean;
}

function TitleBar({
    title,
    children,
    className,
    icon,
    starShowerBlack,
    edgeOrange,
    edgeBlue,
    titleFlexNone,
    withButtons,
    noShadow
}: parms) {
    return (
        <header className={`${className || 'p-5 my-5'} 
                             flex items-center flex-wrap gap-y-3
                             rounded-2xl
                             text capitalize font-extrabold
                             bg-cover bg-bottom 
                             ${noShadow ? '' : 'shadow-lg'}
                             ${starShowerBlack ? 'bg-svg-starshower-black' : ''}
                             ${edgeOrange ? 'bg-svg-edge-orange' : ''}
                             ${edgeBlue ? 'bg-svg-edge-blue' : ''}
                             `}>
            {icon}
            <h1 className={`text-lg ${titleFlexNone ? 'flex-none' : 'flex-grow'} `}>{title}</h1>

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