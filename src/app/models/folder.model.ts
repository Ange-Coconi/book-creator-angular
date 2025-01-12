import { Book } from "./book.model"

export interface Folder {
    name: string,
    items: Array<Book>
}