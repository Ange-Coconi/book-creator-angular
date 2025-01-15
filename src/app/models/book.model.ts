import { v4 as uuidv4 } from 'uuid';
import { Folder } from './folder.model';
import { Page } from './page.model';

export class Book {
    _id: string;
    _title: string;
    _pages: Page[] = [];
    _parent: string = '';

    constructor(title: string, parent: string) {
        this._id = uuidv4();
        this._title = title;
        this._pages = [];
        this._parent = parent;
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title
    }

    set title(title: string) {
        this._title = title;
    }

    get pages(): Page[]{
        return this._pages;
    }

    set pages(pages: Page[]) {
        this._pages = pages;
    }

    get parent(): string{
        return this._parent;
    }

    set parent(parent: string) {
        this._parent = parent;
    }
}