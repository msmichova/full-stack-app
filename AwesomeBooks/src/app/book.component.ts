import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {

    reviewForm: any;
    editBookForm: any;
    editReviewForm: any;

    constructor(
        public webService: WebService,
        public route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public authService: AuthService,
    ) {}

    // async ngOnInit() {    // fired automatically whenever an object has been created
    //     var response = await this.webService.getBook(
    //         this.route.snapshot.params.id
    //     );
    //     this.book = response;    
    // }

    ngOnInit() {

        this.reviewForm = this.formBuilder.group({
            name: ['', Validators.required],
            review: ['', Validators.required],
            stars: 5
        })

        this.editReviewForm = this.formBuilder.group({
            name: ['', Validators.required],
            review: ['', Validators.required],
            stars: 5
        })

        this.editBookForm = this.formBuilder.group({
            title: ['', Validators.required],
            author: ['', Validators.required],
            country: ['', Validators.required],
            imageLink: ['', Validators.required],
            language: ['', Validators.required],
            link: ['', Validators.required],
            pages: ['', Validators.required],
            year: ['', Validators.required]
        })

        this.books = this.webService.getBooks();

        this.book = this.webService.getBook(
            this.route.snapshot.params.id
        );

        this.reviews = this.webService.getReviews(
            this.route.snapshot.params.id
        )

        // this.review = this.webService.getReview(
        //     this.route.snapshot.params.bid,
        //     this.route.snapshot.params.rid
        // )
    } 
    onSubmit() {
        // console.log(this.reviewForm.value);
        this.webService.postReview(this.reviewForm.value)
            .subscribe((response: any) => {
                this.reviewForm.reset();
                this.reviews = this.webService.getReviews(
                    this.route.snapshot.params.id
                );
            });       
        }

    isInvalid(control: any) {
        return  this.reviewForm.controls[control].invalid &&
                this.reviewForm.controls[control].touched;
    }

    isUntouched() {
        return  this.reviewForm.controls.name.pristine &&
                this.reviewForm.controls.review.pristine;
    }

    isIncomplete() {
        return  this.isInvalid('name') ||
                this.isInvalid('review') ||
                this.isUntouched(); 
    }

    onBookDelete() {
        this.webService.deleteBook(this.route.snapshot.params.id)
            .subscribe((response: any) => {
                console.log({response});
                // location.reload();
                window.location.replace("http://localhost:4200/books/");
            });    
    }

    onBookEditSubmit() {
        
        this.webService.putBook(this.editBookForm.value)
        .subscribe((response: any) => {

            this.editBookForm.reset();
            this.book = this.webService.getBook(
                this.route.snapshot.params.id
            );
        }); 
        console.log('Submitted!');
        
    }

    // onReviewEditSubmit(){
    //     this.webService.putReview(this.editReviewForm.value)
    //         .subscribe((response: any) => {
    //             this.editReviewForm.reset();
    //             this.reviews = this.webService.getReviews(
    //                 this.route.snapshot.params.id
    //             );
    //         });      
    // }

    // onReviewDelete(){
    //     this.webService.deleteReview(this.review)
    //     .subscribe((response: any) => {
    //         console.log({response});
    //         location.reload();
    //         // window.location.replace("http://localhost:4200/books/");
    //     }); 

    // }

    books: any = [];
    book: any = [];
    reviews: any = [];
    review: any = [];
}

