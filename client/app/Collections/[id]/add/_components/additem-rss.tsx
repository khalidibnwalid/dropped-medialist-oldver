'use client'

import { Input, Switch } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Controller } from 'react-hook-form';
import { BiBlock, BiRss } from "react-icons/bi";
import { AddItemPageContext } from "../page";


function AddRSS() {
    const { control } = useContext(AddItemPageContext)

    const [isRssAllowed, setIsRssAllowed] = useState(false)

    return (
        <>
            <p className="text-zinc-500">RSS</p>
            <div className="flex gap-x-2 items-center justify-center">
                <Controller
                    control={control}
                    name="RSS" /////// yet to set //should be only url allowed
                    rules={{ required: true }}
                    disabled={isRssAllowed ? false : true}
                    render={({ field }) =>
                        <Input
                            className="mb-3 flex-grow"
                            size="sm"
                            label="RSS link"
                            variant="bordered"
                            type="text"
                            isDisabled={isRssAllowed ? false : true}
                            {...field} />
                    } />


                <Switch
                    className="flex-none mb-2"
                    color="warning"
                    size="lg"
                    isSelected={isRssAllowed}
                    onValueChange={setIsRssAllowed}
                    thumbIcon={({ isSelected }) =>
                        isSelected ? (
                            <BiRss />
                        ) : (
                            <BiBlock className="text-black" />
                        )
                    }
                >
                </Switch>

            </div>

        </>
    )
}

export default AddRSS