
import type { listData, fieldTemplates } from '@/types/list';
import { createContext } from 'react';
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue } from 'react-hook-form';

export interface ListFormContextType {
    control: Control<listData>
    setValue: UseFormSetValue<listData>
    getValues: UseFormGetValues<listData>
    errors: FieldErrors<listData>
    resetField?: UseFormResetField<listData>
    fieldTemplates?: fieldTemplates
    listData?: listData
    /**
    * Data of the List
    * Only used in the Edit Page
    */
}

export const ListFormContext = createContext({} as ListFormContextType)