import { Injectable } from "@angular/core";
import { CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private route: Router) { }

  canActivate(route: any, state: RouterStateSnapshot) {
    
    if (!this.authService.isAuthenticated()) {
      this.route.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      return false;
    }
    return true;

  }
}
