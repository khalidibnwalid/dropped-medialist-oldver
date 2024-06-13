import { UUID } from "crypto"

export interface userType {
    id: UUID
    username: string
    roles: 'admin' | 'member'
    email: string
    // created_at
    // last_login
}