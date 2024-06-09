import { Skeleton } from "@nextui-org/react";

export default function ItemPageLoading() {
    return (
        <div className="py-5 grid grid-cols-5 lg:grid-cols-4 items-start gap-x-5 w-full animate-appearance-in">
            <div className="col-span-1 ">
                {/*poster */}
                <Skeleton className="h-96 aspect-[2/3] rounded-2xl shadow-lg" />
            </div>

            <div className="col-span-4 lg:col-span-3">
                <header className="justify-center rounded-2xl shadow-lg  bg-cover bg-center ">

                    <div className=' rounded-t-inherit backdrop-blur-sm h-30 bg-pure-theme bg-opacity-20 '>
                        <Skeleton className="h-32 w-full rounded-t-inherit shadow-lg" />
                    </div>

                    {/* Over Cover */}
                    <div className='rounded-inherit h-full px-10 pb-10 pt-5 scale-[1.005]
                           bg-pure-theme bg-opacity-[0.85] backdrop-blur-xl shadow-lg space-y-3'>
                        {/* title */}
                        <Skeleton className="h-10 rounded-2xl shadow-lg opacity-40 mb-7" />

                        {/* description */}
                        <Skeleton className="h-5 rounded-2xl shadow-lg opacity-40" />
                        <Skeleton className="h-5 w-5/6 rounded-2xl shadow-lg opacity-40" />

                        <Skeleton className="h-5 rounded-2xl shadow-lg opacity-40" />
                        <Skeleton className="h-5 w-3/5 rounded-2xl shadow-lg opacity-40" />

                        <Skeleton className="h-5 w-1/6 rounded-2xl shadow-lg opacity-40" />

                    </div>
                </header>

            </div>
        </div>
    )
}