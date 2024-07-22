import NavSideBar from "@/components/bars/navsidebar";
import { useContext } from "react";
import { BiCollection, BiHomeAlt2, BiTrashAlt } from "react-icons/bi";
import { RiUserLine } from "react-icons/ri";
import { authContext } from "./authProvider";


export default function Layout({ children }: { children: React.ReactNode }) {
    const { userData } = useContext(authContext)

    const navButtons = [
        // { title: "Home", link: "/", icon: <BiHomeAlt2 key="nav-BiHomeAlt2" /> },
        { title: "Lists", link: "/lists", icon: <BiCollection key="nav-BiHomeAlt2" /> },
        // { title: "Search", link: "/Search", icon: <BiSearch key="nav-BiHomeAlt2" /> },
        // { title: "Settings", link: "/Settings", icon: <BiSliderAlt key="nav-BiHomeAlt2" /> },
        { title: "Trash", link: "/trash", icon: <BiTrashAlt key="nav-BiHomeAlt2" /> },
        // { title: "RSS", link: "/RSS", icon: <BiRss key="nav-BiHomeAlt2" /> },
        { title: userData.username, link: "/user", icon: <RiUserLine key="nav-BiUserCircle" /> },
    ]

    const RightToLeft = false

    return (
        <>
            <NavSideBar navButtons={navButtons} RightToLeft={RightToLeft} />
            <div className={(RightToLeft ? " mr-[90px] ml-[20px]" : " ml-[90px] mr-[20px]") + " pb-20"}>
                {children}
            </div>
        </>
    )
}