import { Input } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemApiTemplateContext } from "./provider";

function ItemApiMainInfo() {
    const { control, errors, listData, currentApiTemplate } = useContext(ItemApiTemplateContext)
    const usedNames = listData?.templates?.apiTemplates?.map(api =>
        (api.name !== currentApiTemplate?.name) && api.name)
        || []

    return (
        <>
            <Controller
                control={control}
                name="name"
                rules={{
                    required: true,
                    validate: (name) => {
                        if (usedNames.includes(name)) {
                            return 'Name is already used, please choose another name';
                        }
                        return true;
                    }
                }}
                render={({ field }) =>
                    <Input
                        isRequired
                        isInvalid={errors.name && true}
                        color={errors.name && "danger"}
                        errorMessage={errors?.name?.message}
                        className="shadow-sm rounded-xl"
                        label="API Template's Name"
                        type="text"
                        {...field}
                    />
                } />

            <Controller
                control={control}
                name="baseURL"
                rules={{
                    required: true,
                    pattern: {
                        value: /^(http|https):\/\/[^ "]+$/i,
                        message: 'Please enter a valid URL',
                    }
                }}
                render={({ field }) =>
                    <Input
                        isInvalid={errors.baseURL && true}
                        color={errors.baseURL && "danger"}
                        errorMessage={errors?.baseURL?.message}
                        isRequired
                        className="shadow-sm rounded-xl"
                        type="text"
                        label="Base URL"
                        {...field}
                    />
                } />

        </>
    )
}

export default ItemApiMainInfo