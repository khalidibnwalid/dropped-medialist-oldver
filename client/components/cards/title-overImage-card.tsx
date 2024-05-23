import { Card, CardFooter, Image } from "@nextui-org/react";
import { useState } from "react";

export default function TitleOverImageCard({
    title,
    imageSrc,
    onPress,
    className,
}: {
    title: string
    onPress?: () => void
    imageSrc?: string
    className?: string
}) {
    const [imageIsLoaded, setImageIsLoaded] = useState(true);

    return (
        <Card
            isFooterBlurred
            radius="lg"
            className={className}
            isPressable onPress={onPress}
        >
            {imageSrc && imageIsLoaded
                ? <Image
                    alt={title}
                    className="object-cover aspect-[2/3]"
                    src={imageSrc}
                    onError={() => setImageIsLoaded(false)}
                />
                : <Card className=" aspect-[2/3] h-full w-full p-2 bg-accented
                                flex items-center justify-center capitalize text-xl"
                >
                    {title}
                </Card>
            }

            <CardFooter className="justify-center items-center
                                ml-1 z-10
                                bottom-1 py-1 absolute  
                              before:bg-white/10 border-white/5 border-1
                                before:rounded-xl rounded-large 
                                w-[calc(100%_-_8px)] 
                                shadow-small "
            >
                <p className="capitalize text-small TEXT text-foreground/80 
                          line-clamp-1 group-hover:line-clamp-3 drop-shadow-lg"
                >
                    {title}
                </p>
            </CardFooter>
        </Card>
    )
}