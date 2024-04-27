import TitleBar from '@/components/bars/titlebar';
import { Divider, Button } from '@nextui-org/react';
import { BiInfoCircle } from 'react-icons/bi'; // Replace 'react-icons/bi' with the actual icon library you're using
import ItemApiQueries from './api-form/query-templates';
import ItemApiRoutes from './api-form/route-templates';
import ItemApiSearchLayout from './api-form/search-layout';
import ItemApiCoverCol from './item-form/cover-col';
import ItemApiPosterCol from './item-form/poster-col';
import ItemApiMainInfo from './main-info';

function ApiFormLayout() {
    return (
        <>
         <div className=' px-4 grid gap-y-3'>
                        <ItemApiMainInfo />
                        <Divider className='my-2' />
                        <div className=' grid grid-cols-3 lg:grid-cols-1 gap-x-4 items-start'>
                            <div className='grid space-y-2'>
                                <p className="text-zinc-500 text-xl">Direct</p>
                                <ItemApiRoutes />
                                <ItemApiQueries />
                            </div>
                            <ItemApiSearchLayout />
                        </div>
                    </div>

                    <TitleBar
                        title="Api Item Template"
                        className="bg-accented p-5 my-5"
                    >
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="shadow-none"
                            target='_blank'
                        >
                            <BiInfoCircle className=" text-2xl" />
                        </Button>
                    </TitleBar>

                    <div className='grid grid-cols-3 gap-x-7 items-start px-4'>
                        <ItemApiPosterCol />
                        <ItemApiCoverCol />
                    </div>
        </>
    );
};

export default ApiFormLayout;