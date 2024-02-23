'use client'

import ListCard from "@/components/cards/list-cards";
import type { CollectionData } from "@/types/collection";
import type { itemData } from "@/types/item";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import { Avatar, Card, CardFooter, Chip, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import CollectionButtons from "./collection-navbuttons";
import { createContext, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { FaStar } from "react-icons/fa";
import ItemBadges from "@/app/Items/[id]/_components/itempage-badges";
import { IMG_PATH } from "@/app/page";


interface context {
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<string>>;
    itemsData: itemData[];
    setItemsData: Dispatch<SetStateAction<itemData[]>>;
    items: itemData[]
}

//using useState inside the main page will cause unnecessary rerander of full page
//which will cause items to be needlessly refetched and the page to be reloaded,
//so i moved it to its own component
export const collectionBodyContext = createContext({} as context);

function CollectionBody({ data, items }: { data: CollectionData, items: itemData[] }) {
    const [viewMode, setViewMode] = useLocalStorage(`col-${data.id}_viewMode`, "cards")
    const [itemsData, setItemsData] = useState<itemData[]>(items || [])
    const router = useRouter();


    return (
        <>
            <collectionBodyContext.Provider value={{ viewMode, setViewMode, itemsData, setItemsData, items }}>

                <CollectionButtons data={data} />

                {viewMode === "cards" &&
                    <div className=" grid grid-cols-md-card gap-x-4 gap-y-4">
                        {itemsData.map((item) => (
                            <Card
                                isFooterBlurred
                                radius="lg"
                                className="group border-none duration-200 hover:scale-110 shadow-perfect-md group aspect-[2/3]"
                                key={item.title}
                                isPressable onPress={() => router.push(`../Items/${item.id}`)}
                            >
                                {item.poster_path ? <Image
                                    alt={item.title}
                                    className="object-cover aspect-[2/3]"
                                    src={`${IMG_PATH}/images/items/${item.poster_path}`}
                                /> :
                                    <Card className=" aspect-[2/3] h-full w-full p-2 bg-[#2f2f2f] flex items-center justify-center capitalize text-xl" >
                                        {item.title}
                                    </Card>
                                }

                                <CardFooter
                                    className="justify-center items-center
                                                ml-1 z-10
                                                bottom-1 py-1 absolute  
                                               before:bg-white/10 border-white/5 border-1
                                               before:rounded-xl rounded-large 
                                               w-[calc(100%_-_8px)] 
                                               shadow-small "
                                >
                                    <p className="capitalize text-small TEXT text-white/80 line-clamp-1 group-hover:line-clamp-3 ">{item.title}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div >
                }

                {viewMode === "cardslist" &&
                    <div className=" grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
                        {itemsData.map((item) => (
                            <div key={item.title} >
                                <ListCard
                                    title={item.title}
                                    discrip={item.description}
                                    image={item.poster_path ? `${  IMG_PATH}/images/items/${item.poster_path}` : undefined}
                                    link={`../Items/${item.id}`}
                                    underTitle={item.badges && <ItemBadges badgesArray={item.badges} />}
                                />
                            </div>
                        ))}
                    </div>
                }

                {viewMode === "list" && (
                    <Table
                        shadow="lg"
                        removeWrapper
                        selectionMode="single"
                    >
                        <TableHeader className="animate-fade-in">
                            <TableColumn>Title</TableColumn>
                            <TableColumn>State</TableColumn>
                            <TableColumn>Badges</TableColumn>
                        </TableHeader>

                        <TableBody>
                            {itemsData.map((item) =>
                                <TableRow
                                    key={item.title}
                                    className="rounded-sm hover:cursor-pointer hover:bg-[#1c1c1c] duration-300 animate-fade-in"
                                    onClick={() => router.push(`../Items/${item.id}`, { scroll: false })}
                                >
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>
                                        {item.progress_state &&
                                            <Chip className=" p-2 opacity-90" variant="flat" color={item.progress_state.color}>
                                                {item.progress_state.name}
                                            </Chip>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {item.badges && <ItemBadges badgesArray={item.badges} />}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )
                }


            </collectionBodyContext.Provider>

        </>
    )
}


export default CollectionBody;