
import type { CollectionData, fieldTemplates } from '@/types/collection';
import { createContext } from 'react';
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue } from 'react-hook-form';

export interface CollectionFormContextType {
    control: Control<CollectionData>
    setValue: UseFormSetValue<CollectionData>
    getValues: UseFormGetValues<CollectionData>
    errors: FieldErrors<CollectionData>
    resetField?: UseFormResetField<CollectionData>
    fieldTemplates?: fieldTemplates
    collectionData?: CollectionData
    /**
    * Data of the Collection
    * Only used in the Edit Page
    */
}

export const CollectionFormContext = createContext({} as CollectionFormContextType)