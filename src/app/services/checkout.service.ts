import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, OrderLocation, OrderContact } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly ORDER_API = `${environment.apiUrl}order-service/api/orders/public`;

  constructor(private http: HttpClient) {}

  createOrder(order: Order) {
    return this.http.post(this.ORDER_API, order);
  }

  getOrderLocationForm(): OrderLocation {
    return {
      streetAddress2: '',
      buildingNumber: 0,
      latitude: 0,
      longitude: 0
    };
  }

  getOrderContactForm(): OrderContact {
    return {
      contactName: '',
      contactValue: ''
    };
  }
}
