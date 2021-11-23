import { Component } from '@angular/core';
import { WebService } from './web.service';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
    constructor(private webService: WebService) {}

    async ngOnInit() {    // fired automatically whenever an object has been created
        var response = await this.webService.getBooks();
        this.book_list = response;    
    }

    book_list: any;     // to avoid type checking errors
}
