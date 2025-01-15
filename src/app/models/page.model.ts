import { v4 as uuidv4 } from 'uuid';
import { Folder } from './folder.model';
import { Book } from './book.model';

export class Page {
    _id: string;
    _number: number;
    _content: string;
    _parent: string = '';

    constructor(number: number, content: string, parent: string) {
        this._id = uuidv4();
        this._number = number;
        this._content = content;
        this._parent = parent;
    }

    get id(): string {
        return this._id;
    }

    get number(): number {
        return this._number
    }

    set number(number: number) {
        this._number = number;
    }

    get content(): string{
        return this._content;
    }

    set content(content: string) {
        this._content = content;
    }
}