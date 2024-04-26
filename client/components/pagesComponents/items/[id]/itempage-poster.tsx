import { Image } from "@nextui-org/react"
import { useContext } from "react"
import { itemViewContext } from "@/pages/items/[id]"

function ItemPoster({className = "w-full"}: {className?: string}) {
    const { itemData, coverPath } = useContext(itemViewContext)

    return itemData.poster_path &&
        <a
            href={coverPath}
            target="_blank"
            className={className}
        >
            <Image
                alt={itemData.title}
                className="w-full shadow-perfect-md object-cover duration-100 hover:scale-105 mb-5"
                src={`${process.env.PUBLIC_IMG_PATH}/images/items/${itemData.poster_path}`}
            />
        </a>

}

export default ItemPoster
