'ues client'

import type { fieldTemplates, listApiType } from '@/types/list';
import { listApiWithSearchType } from '@/types/list';
import { Dispatch, SetStateAction, createContext } from "react";
import type { FieldErrors, UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { Control, UseFormSetValue } from 'react-hook-form';

interface context {
    control: Control<listApiWithSearchType>
    setValue: UseFormSetValue<listApiWithSearchType>
    getValues: UseFormGetValues<listApiWithSearchType>
    errors: FieldErrors<listApiWithSearchType>
    resetField?: UseFormResetField<listApiWithSearchType>
    fieldTemplates?: fieldTemplates
    pathRegex: RegExp
    pattern: { value: RegExp, message: string }
    setSearchIsAllowed: Dispatch<SetStateAction<boolean>>
    searchIsAllowed: boolean
    currentApiTemplate?: listApiType
}


export const ItemApiTemplateContext = createContext({} as context)