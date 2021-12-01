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

    postBook(book: any) {
        console.log("Adding a book.....");
        
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        
        let body = new FormData(); 
        body.append("title", book.title);
        body.append("author", book.author);
        body.append("country", book.country);
        body.append("imageLink", book.imageLink);
        body.append("language", book.language);
        body.append("link", book.link);
        body.append("pages", book.pages);
        body.append("year", book.year);
        
        return this.http.put(
            'http://localhost:5000/api/v1.0/books/', body
        );
    }

    putBook(book: any) {
        
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        
        let body = new FormData(); 
        body.append("title", book.title);
        body.append("author", book.author);
        body.append("country", book.country);
        body.append("imageLink", book.imageLink);
        body.append("language", book.language);
        body.append("link", book.link);
        body.append("pages", book.pages);
        body.append("year", book.year);
        
        return this.http.put(
            'http://localhost:5000/api/v1.0/books/'+this.bookID, body, {headers}
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