/**
 * Used Thumbnails Dimensions and Names:
 * # Item:
 *  ## Poster:
 *  - FileName.Exten_size=700xH.webp => width=700px, height=auto
 *  - FileName.Exten.webp => original size with webp format
 *  ## Images:
 *  - FileName.Exten.webp => original size with webp format
 *
 * # List:
 *  ## Cover:
 *  - FileName.Exten_size=300xH.webp => width=300px, height=auto
 *
 * # Logos:
 *  - FileName.Exten_size=100xH.webp => width=100px, height=auto
 */
export interface CacheConfig {
    /** If not provided will be 'auto' */
    w?: number;
    /** If not provided will be 'auto' */
    h?: number;
    /** If both empty, It will just transform the image to webp */
}

export const listCoverCacheConfigs: CacheConfig[] = [{ w: 300 }];
export const itemPosterCacheConfigs: CacheConfig[] = [{ w: 700 }, {/**Webp*/ }];
export const itemCoverCacheConfigs: CacheConfig[] = [{ w: 300 }]
export const itemImageCacheConfigs: CacheConfig[] = [{/**Webp*/ }]
export const logosCacheConfigs: CacheConfig[] = [{ w: 100 }];

export const cachedImageName = (fileName: string, cacheConfig: CacheConfig) => {
    const isOriginalSize = !cacheConfig?.w && !cacheConfig?.h;
    return isOriginalSize
        ? `${fileName}.webp`
        : `${fileName}_size=${cacheConfig?.w || 'W'}x${cacheConfig?.h || 'H'}.webp`;

};