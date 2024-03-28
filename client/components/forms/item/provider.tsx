
import type { itemData } from '@/types/item';
import type { fieldTemplates } from '@/types/list';
import { createContext } from 'react';
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue } from 'react-hook-form';

export interface itemFormContextType {
    control: Control<itemData>
    setValue: UseFormSetValue<itemData>
    getValues: UseFormGetValues<itemData>
    errors: FieldErrors<itemData>
    resetField?: UseFormResetField<itemData>
    fieldTemplates?: fieldTemplates
    itemData?: itemData
    /**
     * Data of the Item
     * Only used in the Edit Page
     */
}

export const ItemFormContext = createContext({} as itemFormContextType)