import { PageSwallow } from "./page-swallow.model";
import { Page } from "./page.model";


export interface PageRectoVerso {
    index: number;
    recto: PageSwallow;
    verso: PageSwallow;
}