import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
    selector: 'navigation',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    imagePath: String;

    constructor(
        public authService: AuthService,
        public router: Router,
    ){
        this.imagePath = "/assets/awesome-books-logo-white.png";
    }
}