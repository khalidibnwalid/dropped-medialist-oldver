import NavSideBar from "@/components/bars/navsidebar";
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { BiCollection, BiHomeAlt2, BiRss, BiSearch, BiSliderAlt, BiTrashAlt } from "react-icons/bi";
import './globals.css';
import { Providers } from "./providers";

const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: 'MediaPack - %s',
    default: 'MediaPack',
  },
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const navButtons = [
    { title: "Homepage", link: "/", icon: <BiHomeAlt2 key="nav-BiHomeAlt2" /> },
    { title: "lists", link: "/lists", icon: <BiCollection key="nav-BiHomeAlt2" /> },
    // { title: "Search", link: "/Search", icon: <BiSearch key="nav-BiHomeAlt2" /> },
    // { title: "Settings", link: "/Settings", icon: <BiSliderAlt key="nav-BiHomeAlt2" /> },
    { title: "Trash", link: "/Trash", icon: <BiTrashAlt key="nav-BiHomeAlt2" /> },
    // { title: "RSS", link: "/RSS", icon: <BiRss key="nav-BiHomeAlt2" /> },
  ]

  const onRight = false

  return (
    <html lang="en" className="dark">
      <body className={poppins.className} >
        <Providers>

          <NavSideBar navButtons={navButtons} onRight={onRight} />

          <div className={(onRight ? " mr-[90px] ml-[20px]" : " ml-[90px] mr-[20px]" ) + " pb-20"}>
            {children}
          </div>

        </Providers>
      </body>
    </html>
  )
}
