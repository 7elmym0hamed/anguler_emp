import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BadInput } from '../errors/bad-input';
import { NotFoundError } from '../errors/not-found-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { AppError } from '../errors/app-error';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(@Inject(String) private url: string, private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
     
  }

  getPerAction(action: any) {
    return this.http.get(this.url + action)
      .pipe(catchError(this.handleError))
  }

  getPerActionResponeType(action: any, ResponeType: any) {
    return this.http.get(this.url + action, { responseType: ResponeType })
      .pipe(catchError(this.handleError))
  }

  create(resource: any) {
    
    const check = this.http.post(this.url, resource)
      .pipe(catchError(this.handleError));
    return check;

  }

  postPerAction(action: any, resource: any) {
    return this.http.post(this.url + action, resource)
      .pipe(catchError(this.handleError)) }

  update(id: any, resource: any) {
    return this.http.put(this.url + "/" + id, resource)
      .pipe(catchError(this.handleError))
  }

  putPerAction(action: any, id: any, resource: any) {
    return this.http.put(this.url + action + "/" + id, resource)
      .pipe(catchError(this.handleError))
  }

  delete(id: any) {
    return this.http.delete(this.url + "/" + id)
      .pipe(catchError(this.handleError));
  }

  deletePerAction(action: any, id: any) {
    return this.http.delete(this.url + action + "/" + id)
      .pipe(catchError(this.handleError));
  }

  public handleError(errorObj: HttpErrorResponse) {
    if (errorObj.status === 400) {
      const err = new BadInput(errorObj.error);
      return throwError(()=>err)
    }
    if (errorObj.status === 404) {
      const err = new NotFoundError(errorObj.error);
      return throwError(()=>err)
    }
    if (errorObj.status === 403) {
      const err = new NotAuthorizedError(errorObj.error);
      return throwError(()=>err)
    }
    if (errorObj.status === 401) {
      const err = new NotAuthorizedError(errorObj.error);
      return throwError(()=>err)
    }
    const err = new AppError(errorObj.error);
      return throwError(()=>err)
  }

  downloadObjectAsJson(exportObj: any, exportName: any) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

}
