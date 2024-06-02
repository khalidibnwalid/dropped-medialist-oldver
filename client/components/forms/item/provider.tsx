import type { itemData, itemTag } from '@/types/item';
import type { fieldTemplates } from '@/types/list';
import { createContext } from 'react';
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue } from 'react-hook-form';

/** useFieldArray doesn't support primitive types array, only objects, 
 * thus forcing me to do {value: string}[] instead of just string[] D:
 */
export type ItemForm = Omit<itemData, 'related' | 'tags'> & {
    related: { value: itemData['id'] }[],
    tags: { value: itemTag['id'] }[]
}

export interface itemFormContextType {
    control: Control<ItemForm>
    setValue: UseFormSetValue<ItemForm>
    getValues: UseFormGetValues<ItemForm>
    errors: FieldErrors<ItemForm>
    resetField?: UseFormResetField<ItemForm>
    fieldTemplates?: fieldTemplates
    itemData?: itemData
    /**
     * Data of the Item
     * Only used in the Edit Page
     */
}

export const ItemFormContext = createContext({} as itemFormContextType)