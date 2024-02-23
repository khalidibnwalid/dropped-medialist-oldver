'use client'
import { Tabs, Tab, Input, Link, Button, Card, CardFooter, CardBody, CardHeader, Accordion, AccordionItem, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type param = {
    title: string;
    discrip?: string | undefined;
    image: string | undefined;
    link: string;
    underTitle?: React.ReactNode;
    underDiscrop?: React.ReactNode;
    as?: any
    width?: number
    height?: number
}

//should be changed

function ListCard({ title, discrip, image, underTitle, link, as = undefined, width = undefined, height = undefined }: param) {
    const router = useRouter();

    return (
        <div className="flex h-52 shadow-perfect-md bg-[#202020] rounded-xl">
            <Card className="h-52 w-[8.66rem] flex-none z-10 shadow-perfect-md hover:scale-105 duration-200" isPressable onPress={() => router.push(link)}>
                {image ? <Image
                    width={width}
                    height={height}
                    as={as}
                    className="aspect-[2/3] object-cover"
                    alt={title}
                    src={image}
                /> :
                    <Card className="aspect-[2/3] h-full w-full p-2 bg-[#2f2f2f] flex items-center justify-center capitalize text-xl" >
                        {title}
                    </Card>
                }
            </Card>
            <Card className="flex-grow p-5 h-full" onPress={() => router.push(link)} isPressable>
                <p className="text-start text-2xl font-bold px-1 pb-1 duration-200 hover:text-gray-400">{title}</p>
                <div>
                    {underTitle}
                </div>
                <p className="h-20 overflow-hidden py-1 text-left">{discrip}</p>
            </Card>

        </div>
    )
}


{/* <Card className="flex">
<Image src={image} className="h-60 flex-none"/>
<CardBody className="flex-grow">
    <p className="text-2xl font-bold">{title}</p>
    <p>{discrip}</p>
</CardBody>
</Card> */}

export default ListCard