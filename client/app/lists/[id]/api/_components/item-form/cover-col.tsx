'use client'

import { Divider, Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "../../provider";

function ItemApiCoverCol() {
    const { control, errors, pattern } = useContext(ItemApiTemplateContext)

    return (
        <div className="col-span-2 grid gap-y-2">
            <Controller
                control={control}
                name="template.rawCover"
                rules={{ pattern }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.template?.cover_path && true}
                        color={errors.template?.cover_path && "danger"}
                        errorMessage={errors?.template?.cover_path?.message}
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Cover Image Path"
                        {...field}
                    />
                } />
            <Divider className="my-2" />

            <Controller
                control={control}
                name="template.title"
                rules={{ required: true, pattern }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.template?.title && true}
                        color={errors.template?.title && "danger"}
                        errorMessage={errors?.template?.title?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Title Path"
                        {...field}
                    />
                } />

            <Controller
                control={control}
                name="template.description"
                rules={{ pattern }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.template?.description && true}
                        color={errors.template?.description && "danger"}
                        errorMessage={errors?.template?.description?.message}
                        label="Description Path"
                        variant="bordered"
                        className="shadow-sm rounded-xl"
                        type="text"
                        {...field} />
                } />
        </div>
    )
}

export default ItemApiCoverCol