import { Image } from "@nextui-org/react"
import { useContext } from "react"
import { itemViewContext } from "@/pages/items/[id]"
import { authContext } from "../../authProvider"

function ItemPoster({className = "w-full"}: {className?: string}) {
    const { itemData, coverPath } = useContext(itemViewContext)
    const { userData } = useContext(authContext)

    return itemData.poster_path &&
        <a
            href={coverPath}
            target="_blank"
            className={className}
        >
            <Image
                alt={itemData.title}
                className="w-full shadow-perfect-md object-cover duration-100 hover:scale-105 mb-5"
                src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${itemData.list_id}/${itemData.id}/${itemData.poster_path}`}
            />
        </a>

}

export default ItemPoster
