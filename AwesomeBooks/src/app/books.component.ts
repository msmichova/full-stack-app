import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {

    addBookForm: any;

    constructor(
      public webService: WebService,
      public route: ActivatedRoute,
      private formBuilder: FormBuilder,
      public authService: AuthService,
      ) {}

    ngOnInit() {
      if (sessionStorage.page) {
        this.page = Number(sessionStorage.page)
      }

      if (sessionStorage.order) {
        this.order = String(sessionStorage.order)
      }

      this.book_list = this.webService.getBooksOnPage(this.page, this.order);

      this.books = this.webService.getBooks();

      this.addBookForm = this.formBuilder.group({
        title: ['', Validators.required],
        author: ['', Validators.required],
        country: ['', Validators.required],
        imageLink: ['', Validators.required],
        language: ['', Validators.required],
        link: ['', Validators.required],
        pages: ['', Validators.required],
        year: ['', Validators.required]
    })
    }

    previousPage() {
      if (this.page > 1) {
        this.page = this.page - 1;
        sessionStorage.page = this.page; 
        this.book_list = this.webService.getBooksOnPage(this.page, this.order);
      }
    }

    nextPage() {
      this.page = this.page + 1;
      sessionStorage.page = this.page; 
      this.book_list = this.webService.getBooksOnPage(this.page, this.order);
    }

    onBookAddSubmit() {
        
      this.webService.postBook(this.addBookForm.value)
      .subscribe((response: any) => {        
          this.addBookForm.reset();
          location.reload();
      }); 
  }

  onSortByClicked(order: any) {
    this.order = order;
    sessionStorage.order = this.order;
    sessionStorage.page = 1; // return to first page
    this.books = this.webService.getSortedBooks(this.order)
    .subscribe((response: any) => {
      location.reload();
    });   
  }

    book_list: any = [];
    page: number = 1;
    order: string = 'author_desc';
    books: any = [];
}
