import { useContext } from "react"
import { itemViewContext } from "@/pages/items/[id]"

function ItemLowerFields() {
    const { itemData } = useContext(itemViewContext)

    return itemData.extra_fields &&
        <div className="py-3">
            {itemData.extra_fields.map((data) => (
                <p className="text-base py-1" key={data.name}> {data.name}: <b>{data.value}</b> </p>
            ))}

        </div>

}

export default ItemLowerFields
