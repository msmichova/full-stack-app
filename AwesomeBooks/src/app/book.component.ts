import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
    constructor(
        public webService: WebService,
        public route: ActivatedRoute
    ) {}

    // async ngOnInit() {    // fired automatically whenever an object has been created
    //     var response = await this.webService.getBook(
    //         this.route.snapshot.params.id
    //     );
    //     this.book = response;    
    // }

    ngOnInit() {
        this.book = this.webService.getBook(this.route.snapshot.params.id);
    } 

    book: any = [];     // to avoid type checking errors
}
