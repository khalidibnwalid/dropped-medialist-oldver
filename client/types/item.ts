export interface itemImageType {
    id: string
    image_path: string;
    title?: string;
    description?: string;
    item_id: string
}

export interface itemData {
    id: string;
    collection_id: string;
    title: string;
    poster_path?: string | null
    cover_path?: string | null
    description?: string;
    fav?: boolean;
    trash?: boolean;
    tags: string[] //it stores the ids not items, items are stores in a saperate table in the database
    progress_state?: itemProgressState;
    links?: itemlink[]
    content_fields?: itemField[]
    main_fields?: main_fields[]
    badges?: itemBadgesType[];
    related?: string[] //string of ids
    configurations: ItemConfiguration
    extra_fields?: {name: string, value?: string }[]
}

export interface main_fields {
    name: string;
    value: string | number;
    itemId?: string;
    bIsNumber?: boolean;

}

export interface itemTag {
    id: string;
    collection_id?: string;
    name: string
    description?: string
    group_name?: string
}

interface ItemConfiguration {
    layout?:  "1" | "2" | "3" | "4";
  }
  

export interface itemlink {
    url?: string;
    logo_path: string;
    name: string
}


export interface itemBadgesType {
    logo_path: string;
    value: string;
}

interface itemField {
    name: string;
    body: string
}

export interface itemProgressState {
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    name: string
}
