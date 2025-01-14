import { v4 as uuidv4 } from 'uuid';
import { Folder } from './folder.model';

export class Book {
    _id: string;
    _title: string;
    _content?: string;
    _parent: Folder | string = '';

    constructor(title: string, parent: Folder | string) {
        this._id = uuidv4();
        this._title = title;
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

    get content(): string | undefined{
        return this._content;
    }

    set content(content: string) {
        this._content = content;
    }
}