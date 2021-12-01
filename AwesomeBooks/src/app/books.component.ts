import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {

    addBookForm: any;

    constructor(
      public webService: WebService,
      private formBuilder: FormBuilder,
      ) {}

    ngOnInit() {    // fired automatically whenever an object has been created
      if (sessionStorage.page) {
        this.page = Number(sessionStorage.page)
      }
      this.book_list = this.webService.getBooks(this.page);

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
        this.book_list = this.webService.getBooks(this.page);
      }
    }

    nextPage() {
      this.page = this.page + 1;
      sessionStorage.page = this.page; 
      this.book_list = this.webService.getBooks(this.page);
    }

    onBookAddSubmit() {
        
      this.webService.putBook(this.addBookForm.value)
      .subscribe((response: any) => {
          
          this.addBookForm.reset();
          // this.book = this.webService.getBook(
          //     this.route.snapshot.params.id
          // );
      }); 
      console.log('Submitted!');
      
  }

    book_list: any = [];     // to avoid type checking errors
    page: number = 1;
}
