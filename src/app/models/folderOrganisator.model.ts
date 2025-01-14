import { Folder } from "./folder.model";
import { Book } from "./book.model";

export interface folderOrganisator {
    folders: Folder[],
    books: Book[]
}