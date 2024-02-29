import ItemBadgesForm from '@/components/forms/item/components/badges';
import ItemExtraFieldsForm from '@/components/forms/item/components/extra-fields';
import ItemExtraInfoForm from '@/components/forms/item/components/extra-info';
import ItemLinkForm from '@/components/forms/item/components/links';
import ItemMainInfoForm from '@/components/forms/item/components/main-info';
import ItemMainFieldsForm from '@/components/forms/item/components/mainfields';
import ItemNotesForm from '@/components/forms/item/components/notes';
import ItemProgressStateForm from '@/components/forms/item/components/progress-state';
import ItemRelatedItemsForm from '@/components/forms/item/components/related-items';
import ItemTagsForm from '@/components/forms/item/components/tags';
import { itemData, itemTag } from '@/types/item';
import { Divider } from '@nextui-org/react';

export const ItemFormPosterColumn = ({ tagsData, collectionItemsData }: { tagsData: itemTag[], collectionItemsData: itemData[] }) => (
    <>
        <ItemProgressStateForm />
        <Divider className="my-2" />
        <ItemBadgesForm />
        <Divider className="my-2" />
        <ItemMainFieldsForm />
        <Divider className="my-2" />
        <ItemLinkForm />
        <Divider className="my-2" />
        <ItemTagsForm tagsData={tagsData} />
        <Divider className="my-2" />
        <ItemExtraFieldsForm />
        <Divider className="my-2" />
        <ItemRelatedItemsForm dataSet={collectionItemsData} />
    </>
)

export const ItemFormCoverColumn = () => (
    <>
        <ItemMainInfoForm />
        <Divider className="my-2" />
        <ItemExtraInfoForm />
        <Divider className="my-2" />
        <ItemNotesForm />
    </>
)