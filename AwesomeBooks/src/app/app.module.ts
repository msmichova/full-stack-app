import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './books.component'
import { HttpClientModule } from '@angular/common/http';
import { WebService } from './web.service';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { BookComponent } from './book.component';

var routes: any = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'books',
    component: BooksComponent
  },
  {
    path: 'books/:id',
    component: BookComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    HomeComponent,
    BookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
