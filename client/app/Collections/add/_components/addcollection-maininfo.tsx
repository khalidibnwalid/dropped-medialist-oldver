'use client'
import SortableFields from "@/components/forms/sortableFields";
import { Button, Checkbox, Divider, Input, Switch, Tooltip } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Controller } from 'react-hook-form';
import { BiBlock, BiPlus, BiShieldAlt2, BiX } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AddCollectionPageContext } from "../page";


function AddCollMainInfo() {

    const { control } = useContext(AddCollectionPageContext)

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isPinAllowed, setIsPinAllowed] = useState(false)

    
    return (
        <>
            <div className="col-span-3 lg:col-span-2">
                <Controller
                    control={control}
                    name="title"
                    rules={{ required: true }}
                    render={({ field }) =>
                        <Input
                            className="mb-3 shadow-sm rounded-xl" type="text"
                            label="Title" size="lg" isRequired {...field} />
                    } />

                <div id="PinCode" className="flex gap-x-2 items-center justify-center">
                    <Controller
                        control={control}
                        name="pincode"
                        rules={{ required: true }}
                        disabled={isPinAllowed ? false : true}
                        render={({ field }) =>
                            <Input
                                className="mb-3 flex-grow"
                                size="md"
                                label="Pin Code"
                                variant="bordered"
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                                isDisabled={isPinAllowed ? false : true}
                                {...field} />
                        } />

                    <Switch isSelected={isPinAllowed} onValueChange={setIsPinAllowed} className="flex-none mb-2"
                        color="danger" size="lg"
                        startContent={<BiShieldAlt2 />}
                        endContent={<BiBlock />} >
                    </Switch>
                </div>

            </div >
        </>
    )
}


export default AddCollMainInfo