'use client'

import { validate as uuidValidate } from 'uuid';

export default function ListLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    if (!uuidValidate(params.id)) throw new Error ("Bad List ID, Page Doesn't Exist")
    return children
}