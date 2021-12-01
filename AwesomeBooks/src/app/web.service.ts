import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    private bookID: any;
    private reviewID: any;
    
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

    editBook(id: any) {
        this.bookID = id;
        // const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
        
        let body = new FormData(); 
        body.append("title", id.title);
        body.append("author", id.author);
        body.append("country", id.country);
        body.append("imageLink", id.imageLink);
        body.append("language", id.language);
        body.append("link", id.link);
        body.append("pages", id.pages);
        body.append("year", id.year);
        
        return this.http.put(
            'http://localhost:5000/api/v1.0/books/'+id, body
        );
    }

    deleteBook(id: any) {
        this.bookID = id;
        return this.http.delete(
            'http://localhost:5000/api/v1.0/books/'+id
        );
    }

    getReviews(id: any) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/' + 
            id + '/reviews'
        );
    }

    // getReview(bookID: any, reviewID: any) {
    //     return this.http.get(
    //         'http://localhost:5000/api/v1.0/books/' + 
    //         bookID + '/reviews/' + reviewID
    //     );
    // }

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

    // TODO: Edit review
    editReview(review: any) {}

    // deleteReview(bookID: any, reviewID: any) {
        
    //     this.bookID = bookID;
    //     this.reviewID = reviewID;
        
    //     return this.http.delete(
    //         'http://localhost:5000/api/v1.0/books/' +
    //         bookID + '/reviews/' + reviewID); 

    // }


}