import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";
import type { itemData, itemProgressState } from "./item";

export interface listData {
  // map(arg0: (data: itemData) => import("react").JSX.Element): import("react").ReactNode;
  id: string
  title: string
  pincode?: string
  cover_path?: string | null | UploadedImage
  fav?: boolean
  trash?: boolean
  templates?: templates
  configurations?: ListConfiguration[]
}

interface ListConfiguration {
  defaultLayout: "1" | "2" | "3";
}

export interface templates {
  main?: object // main layout
  fieldTemplates?: fieldTemplates
  apiTemplates?: (listApiType)[]
}

export interface fieldTemplates {
  states?: itemProgressState[]
  mainFields?: { name: string, bIsNumber: boolean }[]
  extraFields?: { name: string }[]
  links?: { name: string, logo_path: string }[]
  badges?: { value: string, logo_path: string }[]
}

interface listApi {
  name: string
  baseURL: string
  template: itemData
  queryTemplates?: { name: string, query: string }[]
  /** user will set query from the api-Loader*/
}

interface listApiSearch {
  searchQueryTemplates: {
    /** name: name of the search such as 'Title' will be displayed as 'Search by Title' (only for display)*/
    name: string,
    /** query: query of the search */
    query: string
  }
  /** the value that will be used after picking an item from search results,
   *  it will pick the 'path' and place it raw in 'query' */
  searchNeededValue: { path: string, query: string },
  /**Path to the Title inside the without including search object */
  searchTitlePath: string
  /**Path to the search result array in the API response */
  searchArrayPath: string
}

export type listApiWithSearchType = listApi & listApiSearch
export type listApiType = listApi | listApiWithSearchType
