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

  isBookInvalid(control: any) {
    return  this.addBookForm.controls[control].invalid &&
            this.addBookForm.controls[control].touched;
}

isBookUntouched() {
    return  this.addBookForm.controls.title.pristine &&
            this.addBookForm.controls.author.pristine &&
            this.addBookForm.controls.country.pristine &&
            this.addBookForm.controls.imageLink.pristine &&
            this.addBookForm.controls.language.pristine &&
            this.addBookForm.controls.link.pristine &&
            this.addBookForm.controls.pages.pristine &&
            this.addBookForm.controls.year.pristine;
}

isBookIncomplete() {
    return  this.isBookInvalid('title') ||
            this.isBookInvalid('author') ||
            this.isBookInvalid('country') ||
            this.isBookInvalid('imageLink') ||
            this.isBookInvalid('language') ||
            this.isBookInvalid('link') ||
            this.isBookInvalid('pages') ||
            this.isBookInvalid('year') ||
            this.isBookUntouched(); 
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
