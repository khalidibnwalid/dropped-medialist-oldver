import { items } from "@prisma/client";

export type itemClientData =  Omit<items, 'badges' | 'links'> & {
    badges: itemBadgeType[]
    links: itemlinkType[]
}

export interface itemBadgeType {
    value: string;
    logo_path?: string;
}

export interface itemlinkType {
    name: string;
    logo_path?: string;
}
