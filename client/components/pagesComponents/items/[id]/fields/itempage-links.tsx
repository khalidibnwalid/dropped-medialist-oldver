import { authContext } from "@/components/pagesComponents/authProvider"
import { itemViewContext } from "@/pages/items/[id]"
import { Button, Image } from "@nextui-org/react"
import { useContext, useState } from "react"

function ItemLinks({ className }: { className?: string }) {
    const { itemData } = useContext(itemViewContext)
    const { userData } = useContext(authContext)
    const [imageIsLoaded, setImageIsLoaded] = useState(true);

    return itemData.links &&
        <div className={className}>
            {itemData.links.map((link, index) => {
                const dir = link.logo_path?.startsWith('template_')
                    ? `${itemData.list_id}`
                    : `${itemData.list_id}/${itemData.id}`

                return (
                    <a href={link.url} target="_blank" key={`link-${index}`}>
                        <Button className=" capitalize font-bold text-opacity-80 w-full mb-3 shadow-lg hover:scale-[1.03]"
                            startContent={link.logo_path && imageIsLoaded ?
                                <Image
                                    src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${dir}/${link.logo_path}`}
                                    className="object-contain h-6"
                                    key={'link' + link.name}
                                    alt={`link-logo ${link.url}`}
                                    onError={() => setImageIsLoaded(false)}
                                /> : undefined
                            }
                            key={link.name}>
                            {link.name}
                        </Button>
                    </a>
                )
            })}
        </div>

}

export default ItemLinks
