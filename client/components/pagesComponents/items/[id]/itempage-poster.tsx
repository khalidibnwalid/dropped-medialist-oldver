import { Image } from "@nextui-org/react"
import { useContext, useState } from "react"
import { itemViewContext } from "@/pages/items/[id]"
import { authContext } from "../../authProvider"

function ItemPoster({ className = "w-full" }: { className?: string }) {
    const { itemData, coverPath } = useContext(itemViewContext)
    const { userData } = useContext(authContext)
    const [imageIsLoaded, setImageIsLoaded] = useState(true);

    const srcFolder = `${process.env.PUBLIC_IMG_PATH}/images/${userData.id}/${itemData.list_id}/${itemData.id}`

    return itemData.poster_path && imageIsLoaded &&
        <a
            href={`${srcFolder}/${itemData.poster_path}`}
            target="_blank"
            className={className}
        >
            <Image
                alt={itemData.title}
                className="w-full shadow-perfect-md object-cover duration-100 hover:scale-105 mb-5"
                src={`${srcFolder}/thumbnails/${itemData.poster_path}.webp`}
                onError={() => setImageIsLoaded(false)}
            />
        </a>

}

export default ItemPoster
