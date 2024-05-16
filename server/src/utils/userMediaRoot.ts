import { users } from "@prisma/client";
import path from "path";

export default function userMediaRoot(userId: users['id'], ...IDs: string[]) {
    return IDs
        ? path.join('public', 'users', userId, ...IDs)
        : path.join('public', 'users', userId)
}