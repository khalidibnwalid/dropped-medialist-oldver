import { lists } from "@prisma/client";
import { itemlinkType, itemBadgeType } from "./items";

export type listClientData = Omit<lists, 'templates'> & {
    templates?: templates
    configurations?: object
}

export interface templates {
    main?: object
    fieldTemplates?: fieldTemplates
    apiTemplates?: object[]
}

export interface fieldTemplates {
    states?: { color?: string, name: string }[]
    mainFields?: { name: string, bIsNumber: boolean }[]
    extraFields?: { name: string }[]
    links?: itemlinkType[]
    badges?: itemBadgeType[]
}

