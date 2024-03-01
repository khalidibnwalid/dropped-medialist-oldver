'use client'

import ItemBadges from "@/app/Items/[id]/_components/itempage-badges";
import { IMG_PATH } from "@/app/page";
import ListCard from "@/components/cards/list-cards";
import { Card, CardFooter, Chip, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { collectionBodyContext } from "../provider";


//using useState inside the main page will cause unnecessary rerander of full page
//which will cause items to be needlessly refetched and the page to be reloaded,
//so i moved it to its own component
function CollectionDisplayedItems() {
    const { viewMode, displayedItems } = useContext(collectionBodyContext)
    const router = useRouter();

    return (
        <>
            {viewMode === "cards" &&
                <div className=" grid grid-cols-md-card gap-x-4 gap-y-4">
                    {displayedItems.map((item) => (
                        <Card
                            isFooterBlurred
                            radius="lg"
                            className="group border-none duration-200 hover:scale-110 shadow-lg group aspect-[2/3] "
                            key={item.title}
                            isPressable onPress={() => router.push(`../Items/${item.id}`)}
                        >
                            {item.poster_path
                                ? <Image
                                    alt={item.title}
                                    className="object-cover aspect-[2/3]"
                                    src={`${IMG_PATH}/images/items/${item.poster_path}`}
                                />
                                : <Card className=" aspect-[2/3] h-full w-full p-2 bg-accented flex items-center justify-center capitalize text-xl" >
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
                                <p className="capitalize text-small TEXT text-foreground/80 line-clamp-1 group-hover:line-clamp-3 drop-shadow-lg">{item.title}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div >
            }

            {viewMode === "cardslist" &&
                <div className=" grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
                    {displayedItems.map((item) => (
                        <div key={item.title} >
                            <ListCard
                                title={item.title}
                                discrip={item.description}
                                image={item.poster_path ? `${IMG_PATH}/images/items/${item.poster_path}` : undefined}
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
                        <TableColumn> </TableColumn>
                        <TableColumn>Title</TableColumn>
                        <TableColumn>State</TableColumn>
                        <TableColumn>Badges</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {displayedItems.map((item) =>
                            <TableRow
                                key={item.title}
                                className="hover:cursor-pointer hover:bg-default duration-300 animate-fade-in"
                                onClick={() => router.push(`../Items/${item.id}`, { scroll: false })}
                            >
                                <TableCell>
                                    {item.poster_path
                                        ? <Image
                                            className="flex-shrink-0 max-h-10 aspect-1 object-cover"
                                            alt={item.title}
                                            src={`${IMG_PATH}/images/items/${item.poster_path}`}
                                        />
                                        : <Card
                                            className="uppercase font-light text-xl 
                                               aspect-1 h-10
                                               items-center justify-center 
                                              bg-[#2f2f2f]"

                                            radius="lg"
                                        >
                                            {item.title[0]}
                                        </Card>
                                    }
                                </TableCell>
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

        </>
    )
}


export default CollectionDisplayedItems;