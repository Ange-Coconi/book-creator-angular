import { PageSwallow } from "./page-swallow.model";


export interface PageRectoVerso {
    index: number;
    recto: PageSwallow;
    verso: PageSwallow;
}