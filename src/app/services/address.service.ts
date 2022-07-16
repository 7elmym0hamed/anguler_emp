import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends DataService {

  constructor(http: HttpClient) {
    super(environment.apiURL + '/Address', http)
  }
}
