import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  imagePath: String;
  
  constructor(public authService: AuthService) {
    this.imagePath = "/assets/awesome-books-logo.png";
  }
}
