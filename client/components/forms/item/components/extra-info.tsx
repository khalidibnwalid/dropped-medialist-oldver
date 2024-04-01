'use client'

import BoxRadio from "@/components/forms/_components/box-radio";
import { RadioGroup } from "@nextui-org/react";
import { useContext } from "react";
import { Controller } from 'react-hook-form';
import { ItemFormContext } from "../provider";

function ItemExtraInfoForm() {
    const { control, itemData } = useContext(ItemFormContext)

    return (
        <div>
            <p className="text-zinc-500">Header Layout:</p>
            <Controller
                defaultValue={itemData?.configurations?.layout || '1'}
                control={control}
                name="configurations.layout"
                rules={{ required: true }}
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
                                <img className="w-full -ml-1 mt-1" src="\svg\misc\layout3.svg" />
                            </BoxRadio>
                        </div>
                    </RadioGroup>
                } />
        </div>
    )
}

export default ItemExtraInfoForm