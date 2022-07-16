import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService extends DataService {
 token?: string | null;
  constructor(http: HttpClient, private route: Router) {
    super(environment.apiURL + '/auth', http);
  }

  logout() {
    localStorage.removeItem("token")
    this.route.navigate(['/login'])

  }

  getToken() {
    return this.token;
  }

  isAuthenticated() : boolean{
    
    // here you can check if user is authenticated or not through his token
    this.token = localStorage.getItem('token');
    if (!this.token)
      return false;
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(this.token)
    return true;
  }

  isUserInRole(roleName : any) {
    let token = localStorage.getItem('token')
    if (!token) return false;
    const jwtHelper = new JwtHelperService();
    let decodedToken = jwtHelper.decodeToken(token)
    let roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    if (typeof roles === 'undefined') {
      return false;
    }
    if (typeof (roles) === 'string') {
      if (roles === roleName) return true
    } else {
      if ((roles as string[]).includes(roleName)) return true
    }
    return false;

  }
}
