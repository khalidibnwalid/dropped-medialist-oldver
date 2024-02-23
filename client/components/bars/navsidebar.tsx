"use client" //for usePathname()

import Link from "next/link";
import { usePathname } from "next/navigation";


type navParms = {
    arrayTitle: string[];
    arrayLink: string[];
    arrayIcon: React.ReactNode[];
    onRight: boolean;
}

type navParmsBut = {
    title: string;
    link: string;
    icon: React.ReactNode;
}

let bOnRight: boolean = false;


function NavSideBar({ arrayLink, arrayTitle, arrayIcon, onRight }: navParms) {
    bOnRight = onRight;

    //turning the arrayLink,arrayTitle & arrayIcon into a single array containing them as objects
    // so putting the values in the same order will turn them into menues
    // maybe so I could a custom menu in the database?
    const arrayObject =
        arrayLink.map((value: string, index: number) => ({
            link: value,
            icon: arrayIcon[index],
            title: arrayTitle[index],
        }
        ))

    // since homepage have margin left, there is a major bug on onRight, try it and you will see.

    return ( //try no background/bg //old is #292929 current is #242424 // style={{ backgroundImage: `url(svg/bg.svg)`,    backgroundSize: 'cover'}}

        <nav className={` fixed
                        ${bOnRight ? 'right-2 top-2 h-[98vh]' : 'left-2 top-2 h-[98vh]'}
                         p-3
                         rounded-2xl drop-shadow-lg
                         z-[100]`}>

            {arrayObject.map((data) => (
                <NavBut key={`nav-${data.title}`} link={data.link} icon={data.icon} title={data.title} />
            ))}

        </nav>
    )
}
//
const NavBut = ({ link, title, icon }: navParmsBut) => {
    const pathname = usePathname()
    return (
        <Link className={`flex justify-center group
                          p-2 my-3
                          rounded-lg
                          text-3xl
                          duration-200 
                          hover:bg-white hover:text-[#181818] hover:py-3
                           ${pathname === link ? 'bg-white text-[#181818]' : ''} `} // active the button when we are inside its page: usePathname()
            href={link}>
            {icon}
            <span className={` absolute justify-center 
                            ${bOnRight ? 'right-12 pr-6 rounded-l-lg origin-right' : 'left-12 pl-6 rounded-r-lg origin-left'}
                              p-3 mt-[-11px] 
                              bg-[#393939] shadow-perfect-md
                              font-[400] text-lg text-white
                              duration-200 scale-0 
                              group-hover:scale-100 float-left z-[-1]`}>
                {title}
            </span>
        </Link>

    )
}



export default NavSideBar;

