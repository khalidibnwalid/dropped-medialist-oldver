import { UploadedImage } from "@/components/forms/_components/Images/single-imageUploader";

export interface itemImageType {
    id: string
    image_path: string;
    title?: string;
    description?: string;
    item_id: string
}

export interface itemData {
    id: string;
    list_id: string;
    title: string;
    /**if Null = deleting the image */
    poster_path?: string | null | UploadedImage
    /**if Null = deleting the image */
    cover_path?: string | null | UploadedImage
    /**Only in Add/Edit page */
    rawCover?: UploadedImage;
    /**Only in Add/Edit page */
    rawPoster?: UploadedImage;
    description?: string;
    fav?: boolean;
    trash?: boolean;
    /**array of Tags IDs*/
    tags: string[]
    progress_state?: itemProgressState;
    links?: itemlink[]
    content_fields?: itemField[]
    main_fields?: main_fields[]
    badges?: itemBadgesType[];
    /**array of Items IDs*/
    related?: string[]
    configurations: ItemConfiguration
    extra_fields?: { name: string, value?: string }[]
}

export interface main_fields {
    name: string;
    value: string | number;
    itemId?: string;
    bIsNumber?: boolean;

}

export interface itemTag {
    id: string;
    list_id?: string;
    name: string
    description?: string
    group_name?: string
}

interface ItemConfiguration {
    layout?: "1" | "2" | "3" | "4";
}


export interface itemlink {
    url?: string;
    logo_path: string | UploadedImage;
    name: string
}


export interface itemBadgesType {
    logo_path: string | UploadedImage;
    value: string;
}

interface itemField {
    name: string;
    body: string
}

export interface itemProgressState {
    /**NextUI colors */
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    name: string
}
