import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Response} from "../models/response";

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  constructor(
    private http: HttpClient
  ) { }

  getRates(){
    return this.http.get<Response>(`${environment.apiEndPoint}?function=getTarifas`)
  }
}
