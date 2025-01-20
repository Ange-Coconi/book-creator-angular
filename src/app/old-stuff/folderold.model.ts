import { Book, folderOrganisator, Item } from "./index";
import { v4 as uuidv4 } from 'uuid';

export class Folder {
    _id: string;
    _name: string;
    _items: folderOrganisator = {
        folders: [],
        books: []
    }
    _parent: string = '';

    constructor(name: string, parent: string) {
        this._id = uuidv4();
        this._name = name;
        this._parent = parent;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name;
    }

    get items(): folderOrganisator{
        return this._items;
    }

    get parent(): string{
        return this._parent;
    }

    set parent(parent: string) {
        this._parent = parent;
    }

    addBook(book: Book) {
        this._items.books.push(book);
    }

    addBooks(books: Book[]) {
        this._items.books = [...this._items.books, ...books]
    }

    removeBook(title: string) {
        const IndexBookToRemove: number | Book = this._items.books.findIndex(item => {
            return item.title === title;
        });
        if (IndexBookToRemove !== -1) {
            this._items.books.splice(IndexBookToRemove, 1);
        } else {
            console.log("this book doesn't exist");
        };
    }

    addFolder(folder: Folder) {
        this._items.folders.push(folder);
    }

    addFolders(folders: Folder[]) {
        this._items.folders = [...this._items.folders, ...folders]
    }

    removeFolder(name: string) {
        const IndexFolderToRemove: number | Book = this._items.folders.findIndex(item => {
            return item.name === name;
        });
        if (IndexFolderToRemove !== -1) {
            this._items.folders.splice(IndexFolderToRemove, 1);
        } else {
            console.log("this folder doesn't exist");
        };
    }

}