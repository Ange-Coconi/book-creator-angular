import { Book } from "./book.model";
import { Folder } from "./folder.model";

export type Item = Book | Folder;

export * from "./book.model";
export * from "./folder.model";
export * from "./folderOrganisator.model";