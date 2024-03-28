'use client'

import { Divider, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "../../provider";
import ItemApiBadges from "./badges";
import ItemApiLinks from "./links";
import ItemApiMainFields from "./mainfields";
import ItemApiExtraFields from "./extra-fields";

function ItemApiPosterCol() {
    const { control, errors, pattern } = useContext(ItemApiTemplateContext)

    return (
        <div className="col-span-1 grid gap-y-2">
            <Controller
                control={control}
                name="template.rawPoster"
                rules={{ pattern }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.template?.poster_path && true}
                        color={errors.template?.poster_path && "danger"}
                        errorMessage={errors?.template?.poster_path?.message}
                        label="Poster Image Path"
                        className="shadow-sm rounded-xl"
                        type="text"
                        {...field}
                    />
                } />
            <Divider className="my-2" />
            <ItemApiBadges />
            <Divider className="my-2" />
            <ItemApiMainFields />
            <Divider className="my-2" />
            <ItemApiLinks />
            <Divider className="my-2" />
            <ItemApiExtraFields />
        </div>
    )
}

export default ItemApiPosterCol