import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdressComponent } from './components/lookups/address/adress.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NotAuthorizedComponent } from './components/auth/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/auth/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { NgbAlertModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonComponent } from './components/lookups/person/person.component';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

export function tokenGetter() {
  return localStorage.getItem("token");
}
@NgModule({
  declarations: [
    AppComponent,
    AdressComponent,
    PersonComponent,
    LoginComponent,
    NotAuthorizedComponent,
    NotFoundComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPaginationModule, 
    NgbAlertModule,
    NgbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.allowedDomains,
        disallowedRoutes: environment.disallowedRoutes
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
   
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
