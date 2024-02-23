'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { BiArrowBack, BiRevision } from 'react-icons/bi'

type params ={
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: params) {
    const router = useRouter()
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className=' w-full h-[90vh] flex items-center justify-center flex-col gap-y-10 pr-[70px] animate-fade-in'>

            <p className=' text-7xl font-black'>Something went wrong!</p>
            {error.message && <p className=' text-xl font-semibold text-neutral-400'>Error: {error.message}</p>}
            <div className='flex gap-x-4'>
                <Button
                    variant='bordered'
                    className=' shadow-perfect-md'
                    size='lg'
                    onClick={
                        () => router.back()
                    }
                >
                    <BiArrowBack className=" text-xl" />
                    Go Back
                </Button>
                <Button
                    variant='ghost'
                    className=' shadow-perfect-md'
                    color='primary'
                    size='lg'
                    onClick={
                        () => reset()
                    }
                >
                    <BiRevision className=" text-xl" />
                    Try again
                </Button>
            </div>
        </div>
    )
}