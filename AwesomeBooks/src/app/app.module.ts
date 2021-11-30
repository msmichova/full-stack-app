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
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';

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
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot( {
      domain:'dev-09r98x49.us.auth0.com',
      clientId: 'hA0JGPqDZ6wwUp5VTW9H71VvEnI1D37P'
    }),
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
