import type { listData } from "@/types/list";
import { Card, CardBody, Image } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { useContext, useState } from "react";
import { authContext } from "../authProvider";
import { userType } from "@/types/user";

function ListCards({ lists }: { lists: listData[] }) {
  const { userData } = useContext(authContext)

  return (
    <div className=" grid grid-cols-sm-card gap-x-4 gap-y-4" >
      {lists.map(list => <ListCard key={list.id} list={list} userData={userData} />)}
    </div>
  )
}

function ListCard({ list, userData }: { list: listData, userData: userType }) {
  const [imageIsLoaded, setImageIsLoaded] = useState(true);
  const router = useRouter()

  return (
    <Card
      className=" group bg-transparent duration-200 hover:scale-110 cubic-bezier animate-fade-in"
      key={list.title}
      shadow="none"
      onPress={() => router.push(`../lists/${list.id}`)}
      isPressable
    >
      <CardBody className="overflow-visible p-0">
        {list.cover_path && imageIsLoaded
          ? <Image
            shadow="md"
            radius="lg"
            alt={list.title}
            className=" object-cover aspect-1 bg-accented shadow-lg"
            src={`${process.env.PUBLIC_IMG_PATH}/users/${userData.id}/${list.id}/${list.cover_path}`}
            onError={() => setImageIsLoaded(false)}
          />
          : <Card
            className="uppercase font-light text-7xl text-foreground shadow-lg aspect-1 items-center justify-center bg-accented"
            radius="lg"
          >
            {list.title[0]}
          </Card>
        }
      </CardBody>

      <div className="text-small capitalize
                    h-full w-full py-3
                    flex
                    items-start justify-center 
                    shadow-none
                    duration-200
                    group-hover:font-bold"
      >
        {list.title}
      </div>
    </Card>
  )
}

export default ListCards;
