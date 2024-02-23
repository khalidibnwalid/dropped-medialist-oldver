import NavSideBar from "@/components/bars/navsidebar";
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { BiCollection, BiHomeAlt2, BiSearch, BiSliderAlt, BiStar, BiTrashAlt, BiRss, BiPurchaseTag } from "react-icons/bi"; //BoxIcons
import './globals.css';
import { Providers } from "./providers";


// const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: 'Project Collect - %s',
    default: 'Project Collect',
  },
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={poppins.className} >

        <Providers>

          <NavSideBar
            arrayTitle={["Homepage", "Collections", "Search", "Settings", "Trash", "RSS"]}
            arrayLink={["/", "/Collections", "/Search", "/Settings", "/Trash", "/rss"]}
            arrayIcon={[<BiHomeAlt2 key="nav-BiHomeAlt2" />, <BiCollection key="nav-BiCollection" />,
                        <BiSearch key="nav-BiSearch" />, <BiSliderAlt key="nav-BiSliderAlt" />,
                        <BiTrashAlt key="nav-BiTrashAlt" />, <BiRss key="nav-BiRss" />]}
            onRight={false} />

          <div className=" ml-[90px] mr-[20px] pb-20">
            {children}
          </div>

        </Providers>
      </body>
    </html>
  )
}
