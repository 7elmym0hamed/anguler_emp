import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private route: Router) { }

  canActivate(routeNext : any, state : any) {
    let role: string = routeNext.data['role'] as string;
    if (this.authService.isUserInRole(role)) return true;
    this.route.navigate(['/not-authorized'], { queryParams: { returnUrl: state.url } })
    return false;
  }
}