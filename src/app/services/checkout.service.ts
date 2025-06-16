import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order, OrderLocation, OrderContact} from '../models/order.model';
import {environment} from '../../environments/environment';
import {LocationService} from './location.service';
import {apiConst} from '../api/api.const';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
   baseUrl = apiConst.baseUrl;
  private readonly ORDER_API = `${this.baseUrl}order-service/api/orders/public`;
  private readonly locationService = inject(LocationService)
  constructor(private http: HttpClient) {
  }

  createOrder(order: Order) {
    return this.http.post('/order-service/api/orders/public', order)
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return this.locationService.getCurrentLocation();
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
