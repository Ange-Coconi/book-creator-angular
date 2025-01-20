import { Book } from '../models/book.model'

export function updateIndex(book: Book, index: number) {
    if (!book.pages) return
    
    for (let i = index; i < book.pages.length; i++) {
        book.pages[i].index = i + 1;
    }

    return book;
}