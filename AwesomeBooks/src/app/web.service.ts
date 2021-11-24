import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    private bookID: any;
    
    book_list: any;

    constructor(private http: HttpClient) {}

    getBooks(page: number) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books?pn=' + page
        );
    }

    getBook(id: any) {
        this.bookID = id;
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/'+id
        );
    }

    getReviews(id: any) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/' + 
            id + '/reviews'
        );
    }

    postReview(review: any) {
        let postData = new FormData();
        postData.append("name", review.name);
        postData.append("comment", review.review);
        postData.append("stars", review.stars);

        // let today = new Date();
        // let todayDate = today.getFullYear() + "-" +
        //                 today.getMonth() + "-" +
        //                 today.getDate();
        // postData.append("date", todayDate)

        // TODO: remove this
        console.log("POST DATA: ");
        console.log({postData});

        return this.http.post(
            'http://localhost:5000/api/v1.0/books/' +
            this.bookID + '/reviews', postData); 

    }
}