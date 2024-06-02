import { ItemFormContext } from "@/components/forms/item/provider";
import { itemData } from "@/types/item";
import { listApiType, listApiWithSearchType } from "@/types/list";
import fetchExternalAPI from "@/utils/api/fetchExternalAPI";
import { useDisclosure } from "@nextui-org/react";
import React, { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { apiDataAddItemPage } from "@/pages/lists/[id]/add";
import ItemApiModal from "./modal";

interface searchResultType { search: object[] }

interface context {
    apiTemplates?: listApiType[],
    loadAPITemplate: (apiTemplates: listApiType, query: string) => Promise<{ [key: string]: any; }>
    isOpen: boolean,
    onOpen: () => void,
    onOpenChange: () => void,
    usedAPITemplate?: listApiType,
    setUsedAPITemplate: Dispatch<SetStateAction<listApiType | undefined>>,
    searchApi: (apiTemplates: listApiWithSearchType, query: string) => Promise<void>,
    searchResults: searchResultType,
    apiDataValuesPicker: (apiTemplate: object, newData: object) => { [key: string]: any }
}

export const ItemApiLoaderContext = createContext({} as context)

export default function ItemApiLoaderProvider({
    children,
    setApiData,
    apiData,
    apiTemplates
}: {
    children: React.ReactNode,
    setApiData: Dispatch<SetStateAction<apiDataAddItemPage>>
    apiData: apiDataAddItemPage
    apiTemplates?: listApiType[]
}) {

    const { setValue } = useContext(ItemFormContext)

    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // modal
    /** usedApiTemplate that is used in search */
    const [usedAPITemplate, setUsedAPITemplate] = useState<listApiType | undefined>(undefined)
    const [searchResults, setSearchResults] = useState<searchResultType>({ search: [] } as searchResultType)

    /**
     *  @example
     *  const apiTemplate = { title: "Title", language: "lang::ar", tags: "myArray>>1", MyLang: `"My Language is: "lang::ar ' !!'` }
     *  const dataFetchedFromApi = { Title: "test-title",  lang: { en: "English", ar: "Arabic" },  myArray: ["indexZero", "indexOne"] }
     *  apiDataValuesPicker( apiTemplate , dataFetchedFromApi )
     *  returns: {title: "test-title", language: "Arabic", tags: "indexOne", MyLang: "My Language is: Arabic !!"}
     *  @function 
     *  it will decode the paths and set them as value for the apiTemplate Object like this:
     * 
     * Path: {language: "lang::ar"} => {language: lang.ar} => {language: "Arabic"}
     * 
     * Array Index: {tags: "myArray>>1"} => {tags: myArray[1]} => { tags: "indexOne"}
     * 
     * Constant: {MyLang: `"My Language is: " lang::ar ' !!'`} => {MyLang: "My Language is: " + lang.ar + ' !!'} => {MyLang: "My Language is: Arabic !!"}
     * */
    function apiDataValuesPicker(apiTemplate: object, newData: object) {
        const result: { [key: string]: any } = {};
        /**the operator I used:
         *  single ('') and double ("") notation for constants, 
         * "::" for object paths, 
         * ">>" for selecting an index of array*/
        const regex = /("([^"]*)"|'([^']*)')|[\w\d::>>]+/g

        /** Deals with "::" and ">>" */
        function processedPath(path: string) {
            let current = newData
            path.split('::').forEach((currentPath: string) => {
                if (currentPath.includes('>>')) {
                    const arrayKey = currentPath.split('>>')
                    current = current[arrayKey[0] as keyof typeof newData]?.[parseInt(arrayKey[1])]
                } else {
                    current = current[currentPath as keyof typeof newData]
                }
            })
            return current;
        }

        Object.entries(apiTemplate).forEach(([templateKeyName, value]) => {
            if (typeof (value) === 'object' || Array.isArray(value)) {
                // Deals with objects, arrays
                const pickedValues = apiDataValuesPicker(value, newData) //the current value becomes the template
                result[templateKeyName] = Array.isArray(value) ? Object.values(pickedValues) : pickedValues
            } else if ((value.includes('::') || value.includes('>>') || typeof (value) === 'string')) {
                let values = ''
                const splitByOperator = value.match(regex)
                splitByOperator?.forEach((word: string) => {
                    values += (word.startsWith('"') || word.startsWith("'")) ? word.slice(1, -1) : processedPath(word);
                })
                result[templateKeyName] = templateKeyName === 'logo_path'
                    ? String(value)
                    : values;
            } else {
                // if it doesn't have an 'operator'
                result[templateKeyName] = newData[value as keyof typeof newData]
            }
        });
        return result;
    }


    async function loadAPITemplate(apiTemplates: listApiType, query: string) {

        try {
            const apiRes = await fetchExternalAPI(apiTemplates.baseURL + query)
            const data = apiDataValuesPicker(apiTemplates.template, apiRes)

            for (let key in data) {
                if (!data[key] || data[key] === "") continue; //skip empty values
                if (key === 'cover_path' || key === 'poster_path') {
                    const image = [{ dataURL: data[key] }]
                    setValue(key as keyof itemData, image as any)
                    continue
                }
                setValue(key as keyof itemData, data[key])
            }

            const newApiData: apiDataAddItemPage = {
                itemData: data as itemData,
                key: apiData.key + 1

            }
            setApiData(newApiData)
            return data

        } catch (e) {
            console.error(e)
            throw new Error('Failed to Get Data From The API')
        }
    }

    async function searchApi(apiTemplates: listApiWithSearchType, query: string) {
        if (!apiTemplates.searchQueries) return
        try {
            // await console.log(apiTemplates.baseURL + query) //devmode
            const apiRes = await fetchExternalAPI(apiTemplates.baseURL + query)
            const searchResult = { search: apiRes[apiTemplates.searchArrayPath] || [] }
            setSearchResults(searchResult as searchResultType)
        } catch (e) {
            console.error(e)
            throw new Error('Failed to Get Data From The API')
        }
    }

    return (
        <ItemApiLoaderContext.Provider
            value={{
                loadAPITemplate,
                apiTemplates,
                isOpen,
                onOpen,
                onOpenChange,
                setUsedAPITemplate,
                usedAPITemplate,
                searchApi,
                searchResults,
                apiDataValuesPicker,
            }}
        >
            <ItemApiModal />
            {children}
        </ItemApiLoaderContext.Provider>
    )
}