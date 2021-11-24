import { Component } from '@angular/core';
import { WebService } from './web.service';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
    constructor(public webService: WebService) {}

    ngOnInit() {    // fired automatically whenever an object has been created
      if (sessionStorage.page) {
        this.page = Number(sessionStorage.page)
      }
      this.book_list = this.webService.getBooks(this.page);
    }

    previousPage() {
      if (this.page > 1) {
        this.page = this.page - 1;
        sessionStorage.page = this.page; 
        this.book_list = this.webService.getBooks(this.page);
      }
    }

    nextPage() {
      this.page = this.page + 1;
      sessionStorage.page = this.page; 
      this.book_list = this.webService.getBooks(this.page);
    }

    book_list: any = [];     // to avoid type checking errors
    page: number = 1;
}
