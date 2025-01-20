import { Book } from "./book.model";

export interface Folder {
    id: number;
    name: string;
    root: boolean;
    parentFolderId?: number | null;
    userId: number;
    subfolders?: Folder[];
    books?: Book[];
}