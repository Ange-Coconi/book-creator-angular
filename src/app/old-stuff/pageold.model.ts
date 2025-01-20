import { v4 as uuidv4 } from 'uuid';
import { Folder } from './folder.model';
import { Book } from './book.model';

export class Page {
    _id: string;
    _name: string;
    _index: number;
    _content: string;
    _parent: string = '';

    constructor(index: number, content: string, parent: string) {
        this._id = uuidv4();
        this._name = index.toString();
        this._index = index;
        this._content = content;
        this._parent = parent;
    }

    get id(): string {
        return this._id;
    }

    get name(): string{
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get index(): number {
        return this._index
    }

    set index(index: number) {
        this._index = index;
    }

    get content(): string{
        return this._content;
    }

    set content(content: string) {
        this._content = content;
    }
}