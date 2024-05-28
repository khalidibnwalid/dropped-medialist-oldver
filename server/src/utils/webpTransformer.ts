import sharp from "sharp";

export const webpTransformer = (w?: number, h?: number, sharpPath?: string) => sharp(sharpPath)
    .resize(w, h)
    .toFormat('webp')
    .on('error', error => {
        throw new Error(`Failed to convert image: ${error}`)
    })

