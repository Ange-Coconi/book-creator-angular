import { Page } from "./page.model";


export interface Book {
    id: number;
    title: string;
    format: string;
    padding: string;
    folderId: number;
    userId: number;
    pages?: Page[];
}