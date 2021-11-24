import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {

    reviewForm: any;

    constructor(
        public webService: WebService,
        public route: ActivatedRoute,
        private formBuilder: FormBuilder,
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

        this.book = this.webService.getBook(
            this.route.snapshot.params.id
        );

        this.reviews = this.webService.getReviews(
            this.route.snapshot.params.id
        )
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

    book: any = [];     // to avoid type checking errors
    reviews: any = [];
}
