import { Page } from "./page.model";


export interface Book {
    id: number;
    title: string;
    folderId: number;
    userId: number;
    pages?: Page[];
}