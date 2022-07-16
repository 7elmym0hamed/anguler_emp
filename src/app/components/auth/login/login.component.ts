import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotFoundError } from 'rxjs';
import { AppError } from 'src/app/errors/app-error';
import { BadInput } from 'src/app/errors/bad-input';
import { NotAuthorizedError } from 'src/app/errors/not-authorized-error';
import { AuthModel } from 'src/app/models/AuthModel';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  invalidLogIn: boolean = false;
  isActive: boolean = true;

  constructor(private authService: AuthService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  //#region signIn

  signIn(credentials: any) {
    
    this.authService.postPerAction("/login", credentials).subscribe(
      result => {
        var data = result as AuthModel;
        localStorage.setItem("token", data.token)
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
        this.router.navigate([returnUrl || '/']);

      }
      ,
      (error: AppError) => {
        console.log("error obj", error);
        if (error instanceof BadInput) {
          console.log(error.originalError)
          Swal.fire('Error in saving','','error')
        }
        else if (error instanceof NotFoundError) {
          Swal.fire('Not Found Error','','error')
        }
        if (error instanceof NotAuthorizedError) {
          Swal.fire('Not Authorized to Login','','error')
        } else throw error;
      }
    )
  }
  //#endregion

}
