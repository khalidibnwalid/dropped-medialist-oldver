'use client'

import BoxRadio from "@/components/forms/box-radio";
import { RadioGroup } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { EditItemPageContext } from "../page";

function EditExtraInfo() {
    const { control, itemData } = useContext(EditItemPageContext)

    return (
        <>
            <div>
                <p className="text-zinc-500">Choose Layout:</p>
                <Controller
                    control={control}
                    name="configurations.layout"
                    rules={{ required: true }}
                    defaultValue={itemData.configurations?.layout}
                    render={({ field }) =>
                        <RadioGroup
                            {...field}
                        >
                            <div className="w-full flex flex-wrap gap-4 p-1 mt-1">
                                <BoxRadio value="1">
                                    <img className="w-full -ml-1 mt-1" src="\svg\misc\layout1.svg" />
                                </BoxRadio>
                                <BoxRadio value="2">
                                    <img className="w-full -ml-1 mt-1" src="\svg\misc\layout2.svg" />
                                </BoxRadio>
                                <BoxRadio value="3">

                                </BoxRadio>
                                <BoxRadio value="4">

                                </BoxRadio>
                                <BoxRadio value="5">

                                </BoxRadio>
                            </div>
                        </RadioGroup>
                    } />
            </div>

        </>
    )
}

export default EditExtraInfo