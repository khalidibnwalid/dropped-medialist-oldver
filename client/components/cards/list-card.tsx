import { Card, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

function ListCard({ title, discrip, image, underTitle, link, as, width, height }: param) {
    const router = useRouter();
    const [imageIsLoaded, setImageIsLoaded] = useState(true);

    return (
        <div className="flex h-52 shadow-lg bg-default/10 rounded-xl">
            <Card
                className="h-52 w-[8.66rem] flex-none z-10 shadow-lg hover:scale-105 cubic-bezier duration-200"
                onPress={() => router.push(link)}
                isPressable
            >
                {image && imageIsLoaded
                    ? <Image
                        width={width}
                        height={height}
                        as={as}
                        className="aspect-[2/3] object-cover"
                        alt={title}
                        src={image}
                        onError={() => setImageIsLoaded(false)}
                    />
                    : <Card className="aspect-[2/3] h-full w-full p-2 bg-accented flex items-center justify-center capitalize text-xl" >
                        {title}
                    </Card>
                }
            </Card>
            <Card
                className="flex-grow p-5 h-full bg-default/20 hover:bg-default/40"
                onPress={() => router.push(link)}
                isPressable
            >
                <p className="text-start text-2xl font-bold px-1 pb-1 duration-200 hover:text-gray-400">
                    {title}
                </p>
                <div>
                    {underTitle}
                </div>
                <p className="h-20 overflow-hidden py-1 text-left">
                    {discrip}
                </p>
            </Card>

        </div>
    )
}

export default ListCard