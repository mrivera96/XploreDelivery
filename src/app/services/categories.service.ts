import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { Response } from '../models/response';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient
  ) { }

  getAllCategories(){
    return this.http.get<Response>(`${environment.apiEndPoint}?function=getCategories`);
  }
}
