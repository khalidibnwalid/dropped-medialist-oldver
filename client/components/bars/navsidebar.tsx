"use client"

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsSun } from "react-icons/bs";
import { RiMoonClearLine } from "react-icons/ri";


type navParms = {
    onRight: boolean;
    navButtons: navParmsBut[]
}

type navParmsBut = {
    title: string;
    link: string;
    icon: React.ReactNode;
}

type navParmsClickBut = {
    title: string
    onClick: Function;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode
}

let bOnRight: boolean | undefined = undefined

function NavSideBar({ onRight = false, navButtons }: navParms) {
    bOnRight = onRight;
    // since homepage have margin left, there is a major bug on onRight, try it and you will see.

    const { theme, setTheme } = useTheme()

    return ( 

        <nav className={` fixed
                        ${bOnRight ? 'right-2 top-2 h-[98vh]' : 'left-2 top-2 h-[98vh]'}
                         p-3
                         rounded-2xl drop-shadow-lg
                         z-[100]`}
        >

            {navButtons.map((button) => (
                <NavBut key={'nav-' + button.title} link={button.link} icon={button.icon} title={button.title} />
            ))}

            <ClickBut
                title="Theme"
                icon={theme === 'dark' ? <RiMoonClearLine /> : <BsSun />}
                onClick={() => theme === 'dark' ? setTheme('light') : setTheme('dark')}
            />

        </nav>
    )
}

const buttonClassNames = " flex justify-center group p-2 my-3 rounded-lg text-3xl duration-200  hover:bg-foreground hover:text-background hover:py-3"
const spanClassNames = (bOnRight ? 'right-12 pr-6 rounded-l-lg origin-right' : 'left-12 pl-6 rounded-r-lg origin-left') + " absolute justify-center  p-3 mt-[-11px]  bg-accented shadow-lg font-[400] text-lg text-foreground duration-200 scale-0 group-hover:scale-100 float-left z-[-1]"

const NavBut = ({ link, title, icon }: navParmsBut) => {
    const pathname = usePathname()
    return (
        <Link
            className={(pathname === link && 'bg-foreground text-background') + buttonClassNames} // active the button when we are inside its page: usePathname()
            href={link}
        >
            {icon}
            <span className={spanClassNames}>
                {title}
            </span>
        </Link>

    )
}

const ClickBut = ({ title, icon, onClick, activeIcon }: navParmsClickBut) => {
    const [isActive, setIsActive] = useState(false)
    return (
        <button
            className={buttonClassNames} // active the button when we are inside its page: usePathname()
            onClick={() => { onClick(); setIsActive(!isActive) }}
        >
            {isActive ? (activeIcon || icon) : icon}
            <span className={spanClassNames}>
                {title}
            </span>
        </button>

    )
}

export default NavSideBar;

