import NavSideBar from "@/components/bars/navsidebar";
import { BiCollection, BiHomeAlt2, BiTrashAlt } from "react-icons/bi";

export default function Layout({ children }: { children: React.ReactNode }) {
    const navButtons = [
        { title: "Homepage", link: "/", icon: <BiHomeAlt2 key="nav-BiHomeAlt2" /> },
        { title: "lists", link: "/lists", icon: <BiCollection key="nav-BiHomeAlt2" /> },
        // { title: "Search", link: "/Search", icon: <BiSearch key="nav-BiHomeAlt2" /> },
        // { title: "Settings", link: "/Settings", icon: <BiSliderAlt key="nav-BiHomeAlt2" /> },
        { title: "Trash", link: "/trash", icon: <BiTrashAlt key="nav-BiHomeAlt2" /> },
        // { title: "RSS", link: "/RSS", icon: <BiRss key="nav-BiHomeAlt2" /> },
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