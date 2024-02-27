'use client'

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BiRevision } from "react-icons/bi";




function RefreshButton({ size }: { size?: "sm" | "md" | "lg" | undefined; }) {
    const router = useRouter();
    const refreshPage = () => router.refresh()
    return (
        <Button
            size={size}
            className="bg-accented"
            variant="solid"
            type="button"
            onPress={refreshPage}
        >
            <BiRevision className="text-base" /> Refresh
        </Button>
    )
}

export default RefreshButton;