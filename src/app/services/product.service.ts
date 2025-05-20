import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductResponse} from '../response/ProductResponse.type';
import {catchError, single} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpClient = inject(HttpClient);



  getAllProducts(storeName: string) {
    return this.httpClient
      .get<ProductResponse>(`/product-service/api/products/public/${storeName}`)

  }
}
