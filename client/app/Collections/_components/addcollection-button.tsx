'use client'

import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { BiPlus } from "react-icons/bi";

function ButAddCollection() {
    const router = useRouter();

    // todo inputs: default_fields, cover_path
    return (
            <Button onPress={() => router.push('/Collections/add')} className="focus:outline-none bg-[#282828]" variant="solid"
                type="button">
                <BiPlus className="text-xl"/> Add
            </Button>
    )
}





export default ButAddCollection;