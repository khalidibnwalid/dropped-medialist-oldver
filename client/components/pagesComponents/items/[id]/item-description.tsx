import { Button } from '@nextui-org/react';
import { useState } from 'react';

interface props {
    description?: string
    maxLength?: number
    className?: string
}

const ItemDescription = ({ description, maxLength = 450, className }: props) => {
    const [showMore, setShowMore] = useState(false);

    const toggleDescription = () => {
        setShowMore(!showMore);
    };

    const endChar = description && description.length > maxLength ? '...' : '';
    const itemDescription = showMore ? description : (description?.slice(0, maxLength) + endChar);

    return description && (
        <div className={'flex flex-col justify-center ' + className}>
            <p className=" whitespace-pre-wrap w-full md:text-sm">{itemDescription}</p>
            {description.length > maxLength && (
                <Button className='mt-3 border-pure-opposite border-t-[0.5px] bg-transparent rounded-none duration-100 hover:bg-pure-opposite/10 hover:rounded-b-xl' size='sm'  onClick={toggleDescription}>
                    {showMore ? 'Show Less' : 'Show More'}
                </Button>
            )}
        </div>
    );
};

export default ItemDescription;