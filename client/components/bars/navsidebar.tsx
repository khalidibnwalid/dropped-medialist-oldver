import deleteAPI from "@/utils/api/deleteAPI";
import { Spinner } from "@nextui-org/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { BsSun } from "react-icons/bs";
import { RiMoonClearLine } from "react-icons/ri";
import { queryClient } from "../pagesComponents/providers";

type navPropsBut = {
    title: string;
    link: string;
    icon: React.ReactNode;
}

type navPropsClickBut = {
    title: string
    onClick: Function;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode
    isDisabled?: boolean
}

let bOnRight: boolean | undefined = undefined

function NavSideBar({
    RightToLeft = false,
    navButtons,
    bottomButtons
}: {
    RightToLeft: boolean;
    navButtons: navPropsBut[]
    bottomButtons?: navPropsBut[]
}) {
    bOnRight = RightToLeft;
    // since homepage have margin left, there is a major bug on onRight, try it and you will see.
    const { theme, setTheme } = useTheme()

    return (
        <nav className={` fixed flex flex-col gap-y-3 pt-10
                        ${bOnRight ? 'right-0 top-0' : 'left-0 top-0'}
                         h-[100vh] p-5 rounded-2xl drop-shadow-lg z-[100]`}
        >

            {navButtons.map((button) => (
                <NavBut key={'nav-' + button.title} link={button.link} icon={button.icon} title={button.title} />
            ))}

            <div className="flex-grow"></div>

            {bottomButtons?.map((button) => (
                <NavBut key={'nav-' + button.title} link={button.link} icon={button.icon} title={button.title} />
            ))}

            <ClickBut
                title="Theme"
                icon={theme === 'dark' ? <RiMoonClearLine /> : <BsSun />}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />

            <LogOutBut />

        </nav>
    )
}

const buttonClassNames = " flex justify-center group p-2 rounded-lg text-3xl duration-200 hover:bg-foreground hover:text-background hover:py-3"
const spanClassNames = (bOnRight ? 'right-12 pr-8 rounded-l-lg origin-right' : 'left-12 pl-8 rounded-r-lg origin-left') + " absolute justify-center  p-3 mt-[-11px]  bg-accented shadow-lg font-[400] text-lg text-foreground duration-200 scale-0 group-hover:scale-100 float-left z-[-1]"

const NavBut = ({ link, title, icon }: navPropsBut) => {
    const router = useRouter()
    const pathname = router.pathname
    return (
        <Link
            // active the button when we are inside its page: usePathname()
            className={(pathname === link && 'bg-foreground text-background') + buttonClassNames}
            href={link}
        >
            {icon}
            <span className={spanClassNames}>
                {title}
            </span>
        </Link>

    )
}

const ClickBut = ({ title, icon, onClick, activeIcon, isDisabled }: navPropsClickBut) => {
    const [isActive, setIsActive] = useState(false)
    return (
        <button
            className={buttonClassNames} // active the button when we are inside its page: usePathname()
            onClick={() => { onClick(); setIsActive(!isActive) }}
            disabled={isDisabled}
        >
            {isActive ? (activeIcon || icon) : icon}
            <span className={spanClassNames}>
                {title}
            </span>
        </button>

    )
}

const LogOutBut = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function logout() {
        setIsLoading(true)
        await deleteAPI('sessions')
        setIsLoading(false)
        router.push('/')
        queryClient.clear()
    }

    return (
        <ClickBut
            title="Logout"
            icon={isLoading ? <Spinner color="current" /> : <BiLogOutCircle />}
            onClick={logout}
            isDisabled={isLoading}
        />
    )
}

export default NavSideBar;

