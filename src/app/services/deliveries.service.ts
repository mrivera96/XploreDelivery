import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { Response } from '../models/response';
@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(private http: HttpClient) { }

    newDelivery(deliveryForm, orders, pago) {
    return this.http.post<Response>(`${environment.apiEndPoint}`, {'function': 'insertDelivery', deliveryForm, orders, 'pago': pago});
  }
}
