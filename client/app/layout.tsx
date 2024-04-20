import NavSideBar from "@/components/bars/navsidebar";
import UserAuthLayout from "@/components/forms/user-auth/layout";
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { cookies } from "next/headers";
import { BiCollection, BiHomeAlt2, BiTrashAlt } from "react-icons/bi";
import './globals.css';
import { Providers } from "./providers";

const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: 'Medialist - %s',
    default: 'Medialist',
  },
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  //should check if user exist
  const isLoggedin = cookies().get('auth_session')?.value

  const navButtons = [
    { title: "Homepage", link: "/", icon: <BiHomeAlt2 key="nav-BiHomeAlt2" /> },
    { title: "lists", link: "/lists", icon: <BiCollection key="nav-BiHomeAlt2" /> },
    // { title: "Search", link: "/Search", icon: <BiSearch key="nav-BiHomeAlt2" /> },
    // { title: "Settings", link: "/Settings", icon: <BiSliderAlt key="nav-BiHomeAlt2" /> },
    { title: "Trash", link: "/Trash", icon: <BiTrashAlt key="nav-BiHomeAlt2" /> },
    // { title: "RSS", link: "/RSS", icon: <BiRss key="nav-BiHomeAlt2" /> },
  ]

  const RightToLeft = false

  return (
    <html lang="en" className="dark">
      <body className={poppins.className} >
        <Providers>
          {isLoggedin
            ? <>
              <NavSideBar navButtons={navButtons} onRight={RightToLeft} />

              <div className={(RightToLeft ? " mr-[90px] ml-[20px]" : " ml-[90px] mr-[20px]") + " pb-20"}>
                {children}
              </div>
            </>
            : <UserAuthLayout />
          }
        </Providers>
      </body>
    </html>
  )
}
