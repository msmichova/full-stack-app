import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    private bookID: any;
    private reviewID: any;
    
    book_list: any;

    constructor(private http: HttpClient) {}

    getBooksOnPage(page: number) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books?pn=' + page
        );
    }

    getBooks() {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books'
        );
    }

    getBook(id: any) {
        this.bookID = id;
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/'+id
        );
    }

    postBook(book: any) {
        
        let bookData = new FormData(); 
        bookData.append("title", book.title);
        bookData.append("author", book.author);
        bookData.append("country", book.country);
        bookData.append("imageLink", book.imageLink);
        bookData.append("language", book.language);
        bookData.append("link", book.link);
        bookData.append("pages", book.pages);
        bookData.append("year", book.year);

        return this.http.post(
            'http://localhost:5000/api/v1.0/books', bookData); 
    }

    putBook(book: any) {
          
        let bookData = new FormData(); 
        bookData.append("title", book.title);
        bookData.append("author", book.author);
        bookData.append("country", book.country);
        bookData.append("imageLink", book.imageLink);
        bookData.append("language", book.language);
        bookData.append("link", book.link);
        bookData.append("pages", book.pages);
        bookData.append("year", book.year);
        
        return this.http.put(
            'http://localhost:5000/api/v1.0/books/' + this.bookID, bookData); 
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

    getReview(bid: any, rid: any) {
        console.log({bid});
        console.log({rid});
        
        
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/' + 
            bid + '/reviews/' + rid
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

        return this.http.post(
            'http://localhost:5000/api/v1.0/books/' +
            this.bookID + '/reviews', postData); 

    }

    // TODO: test this
    putReview(review: any) {
        let postData = new FormData();
        postData.append("name", review.name);
        postData.append("comment", review.review);
        postData.append("stars", review.stars);

        // let today = new Date();
        // let todayDate = today.getFullYear() + "-" +
        //                 today.getMonth() + "-" +
        //                 today.getDate();
        // postData.append("date", todayDate)

        return this.http.put(
            'http://localhost:5000/api/v1.0/books/' +
            this.bookID + '/reviews', postData); 

    }

    // TODO: test this
    deleteReview(rid: any) {     
        return this.http.delete(
            'http://localhost:5000/api/v1.0/books/' +
            this.bookID + '/reviews/' + rid); 
    }


}