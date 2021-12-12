import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

    editReviewForm: any;

    constructor(
        public webService: WebService,
        public route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public authService: AuthService,
    ) {}

    ngOnInit() {

        this.editReviewForm = this.formBuilder.group({
            name: ['', Validators.required],
            review: ['', Validators.required],
            stars: 5
        })

        this.books = this.webService.getBooks();

        this.book = this.webService.getBook(
            this.route.snapshot.params.bid
        );

        this.reviews = this.webService.getReviews(
            this.route.snapshot.params.bid
        );

        this.review = this.webService.getReview(
            this.route.snapshot.params.bid,
            this.route.snapshot.params.rid
        );
    } 

    isInvalid(control: any) {
        return  this.editReviewForm.controls[control].invalid &&
                this.editReviewForm.controls[control].touched;
    }

    isUntouched() {
        return  this.editReviewForm.controls.name.pristine &&
                this.editReviewForm.controls.review.pristine;
    }

    isIncomplete() {
        return  this.isInvalid('name') ||
                this.isInvalid('review') ||
                this.isUntouched(); 
    }

    onReviewEditSubmit(){
    this.webService.putReview(this.editReviewForm.value)
        .subscribe((response: any) => {
            this.editReviewForm.reset();
            this.reviews = this.webService.getReviews(
                this.route.snapshot.params.id
            );
            location.reload();
        });      
    }

    onReviewDelete(){
        this.book = this.route.snapshot.params.bid;
        
        this.webService.deleteReview(
            this.route.snapshot.params.bid,
            this.route.snapshot.params.rid
        )
        .subscribe((response: any) => {
            console.log({response});
            window.location.replace("http://localhost:4200/books/" + this.book);
        }); 
    }

    
    books: any = [];
    book: any = [];
    reviews: any = [];
    review: any = [];
}

