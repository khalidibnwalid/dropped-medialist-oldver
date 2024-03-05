import type { itemData, itemProgressState } from "./item";

export interface listData {
  map(arg0: (data: itemData) => import("react").JSX.Element): import("react").ReactNode;
  id: string
  title: string
  pincode?: string
  cover_path?: string | null
  fav?: boolean
  trash?: boolean
  templates?: templates
  configurations?: ListConfiguration[]
}

interface ListConfiguration {
  // defaultLayout?: undefined | "1" | "2" | "3";
}

export interface templates {
  main?: object // main layout
  fieldTemplates?: fieldTemplates
}

export interface fieldTemplates {
  states?: itemProgressState[]
  mainFields?: { name: string, bIsNumber: boolean }[]
  extraFields?: { name: string }[]
  links?: { name: string, logo_path: string }[]
  badges?: { value: string, logo_path: string }[]
}