import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { NotAuthorizedComponent } from './components/auth/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/auth/not-found/not-found.component';
import { AdressComponent } from './components/lookups/address/adress.component';
import { PersonComponent } from './components/lookups/person/person.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [

  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'not-authorized', component: NotAuthorizedComponent, data: { title: 'Not Authorized' } },
  { path: 'not-found', component: NotFoundComponent, data: { title: 'Not Found' } },
  {
    path: 'address', component: AdressComponent, data: { title: 'Address'}, canActivate: [AuthGuard]
  },
  {
    path: 'person', component: PersonComponent, data: { title: 'Person'}, canActivate: [AuthGuard]
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
