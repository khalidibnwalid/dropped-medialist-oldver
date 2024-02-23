'use client'

import type { CollectionData } from "@/types/collection";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import "dotenv/config";
import { IMG_PATH } from "@/app/page";


type cardParam = {
  dataArray: CollectionData[]
}


function CollectionCards({ dataArray }: cardParam) {
  const router = useRouter();

  return (
    <div className=" grid grid-cols-sm-card gap-x-4 gap-y-4" >
      {dataArray.map((data) => (
        <Card
          className=" group bg-transparent duration-200 hover:scale-110 animate-fade-in"
          key={data.title}
          shadow="none"
          onPress={() => router.push(`../Collections/${data.id}`, { scroll: false })}
          isPressable
        >

          <CardBody className="overflow-visible p-0 shadow-perfect-md">
            {data.cover_path ?
              <Image
                shadow="md"
                radius="lg"
                alt={data.title}
                className=" object-cover aspect-1 bg-[#2f2f2f]"
                src={`${IMG_PATH}/images/collections/${data.cover_path}`}
              />
              :
              <Card
                className="uppercase font-light text-7xl 
                           aspect-1
                           items-center justify-center 
                          bg-[#2f2f2f]"

                radius="lg"
              >
                {data.title[0]}
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
            {data.title}
          </div>
        </Card>
      ))}
    </div>
  )
}


export default CollectionCards;
