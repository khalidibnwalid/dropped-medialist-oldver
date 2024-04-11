import { UUID } from "crypto"

export interface userType {
    id: UUID
    username: string
    roles: string
    email: string
    // created_at
    // last_login      
}