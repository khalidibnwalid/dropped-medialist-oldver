import ListCard from "@/components/cards/list-card";
import TitleOverImageCard from "@/components/cards/title-overImage-card";
import ItemBadges from "@/components/pagesComponents/items/[id]/itempage-badges";
import { Card, Chip, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { authContext } from "../../authProvider";
import { listBodyContext } from "./provider";

function ListDisplayedItems() {
    const { viewMode, displayedItems } = useContext(listBodyContext)
    const { userData } = useContext(authContext)
    const router = useRouter();

    return (
        <>
            {viewMode === "cards" &&
                <div className=" grid grid-cols-md-card gap-x-4 gap-y-4">
                    {displayedItems.map(item =>
                        <TitleOverImageCard
                            key={item.title}
                            title={item.title}
                            onPress={() => router.push(`../items/${item.id}`)}
                            imageSrc={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${item.list_id}/${item.id}/${item.poster_path}`}
                            className="border-none duration-200 hover:scale-110 cubic-bezier shadow-lg group aspect-[2/3] animate-fade-in"
                        />
                    )}
                </div >
            }

            {viewMode === "cardslist" &&
                <div className=" grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
                    {displayedItems.map(item => (
                        <div key={item.title} >
                            <ListCard
                                title={item.title}
                                discrip={item.description}
                                image={item.poster_path ? `${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${item.list_id}/${item.id}/${item.poster_path}` : undefined}
                                link={`../items/${item.id}`}
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
                        {displayedItems.map(item =>
                            <TableRow
                                key={item.title}
                                className="hover:cursor-pointer hover:bg-default duration-300 animate-fade-in"
                                onClick={() => router.push(`../items/${item.id}`)}
                            >
                                <TableCell>
                                    {item.poster_path
                                        ? <Image
                                            className="flex-shrink-0 max-h-10 aspect-1 object-cover"
                                            alt={item.title}
                                            src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${item.list_id}/${item.id}/${item.poster_path}`}
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


export default ListDisplayedItems;