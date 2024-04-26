import type { listData } from "@/types/list";
import { Card, CardBody, Image } from "@nextui-org/react";
import { useRouter } from 'next/router';

function ListCards({ dataArray }: { dataArray: listData[] }) {
  const router = useRouter();

  return (
    <div className=" grid grid-cols-sm-card gap-x-4 gap-y-4" >
      {dataArray.map((data) => (
        <Card
          className=" group bg-transparent duration-200 hover:scale-110 animate-fade-in"
          key={data.title}
          shadow="none"
          onPress={() => router.push(`../lists/${data.id}`)}
          isPressable
        >

          <CardBody className="overflow-visible p-0">
            {data.cover_path ?
              <Image
                shadow="md"
                radius="lg"
                alt={data.title}
                className=" object-cover aspect-1 bg-accented shadow-lg"
                src={`${process.env.PUBLIC_IMG_PATH}/images/lists/${data.cover_path}`}
              />
              :
              <Card
                className="uppercase font-light text-7xl text-foreground shadow-lg
                           aspect-1
                           items-center justify-center 
                          bg-accented"

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


export default ListCards;
