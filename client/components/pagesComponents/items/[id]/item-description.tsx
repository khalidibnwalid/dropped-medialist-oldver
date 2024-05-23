import { Button } from '@nextui-org/react';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useState } from 'react';

const ItemDescription = ({
    description,
    className
}: {
    description?: string
    className?: string
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDescription = () => setIsOpen(!isOpen)

    const variants: Variants = {
        open: {
            height: "auto",
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.25,
            },
        },
        closed: {
            height: 100,
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.25
            },
        }
    }

    return description && (
        <AnimatePresence>
            <div className={'flex flex-col justify-center ' + className}>
                <motion.div
                    className='overflow-hidden whitespace-pre-wrap w-full md:text-sm'
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                    variants={variants}
                >
                    {description}
                </motion.div>

                <Button className='mt-3 border-pure-opposite border-t-[0.5px] bg-transparent rounded-none duration-100 hover:bg-pure-opposite/10 hover:rounded-b-xl' size='sm' onClick={toggleDescription}>
                    {isOpen ? 'Show Less' : 'Show More'}
                </Button>
            </div>
        </AnimatePresence>
    )
};

export default ItemDescription;