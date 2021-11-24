import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    book_list: any;

    constructor(private http: HttpClient) {}

    getBooks(page: number) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books?pn=' + page
        );
    }

    getBook(id: any) {
        return this.http.get(
            'http://localhost:5000/api/v1.0/books/'+id
        );
    }
}