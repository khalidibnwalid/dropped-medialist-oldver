import { Chip, Image } from "@nextui-org/react";
import { useState } from "react";

export default function ImageChip({ src, value }: { src?: string, value?: string }) {
    const [imageIsLoaded, setImageIsLoaded] = useState(true);

    return value && (
        <Chip
            className=" opacity-90"
            variant="flat"
            avatar={src && imageIsLoaded && (
                <Image
                    className=" rounded-full object-contain"
                    alt={`avatar-${value}`}
                    src={src}
                    onError={() => setImageIsLoaded(false)}
                />
            )}
        >
            {value}
            {value.length <= 1 && <> </> /* chips don't work well with a single character */}
        </Chip>
    )
}