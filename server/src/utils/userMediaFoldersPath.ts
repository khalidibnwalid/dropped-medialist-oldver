import path from "path";

export default function userMediaFoldersPath(userId: string) {
    const root = path.join('public', 'users', userId)
    const imageRoot = path.join(root, 'images')

    const paths = {
        root,
        items: path.join(imageRoot, 'items'),
        lists: path.join(imageRoot, 'lists'),
        logos: path.join(imageRoot, 'logos'),
    }

    return paths;
}