// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import {CartItem} from '../models/Cartitem.model';
// import {ProductType} from '../models/Product.type';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private cartSubject = new BehaviorSubject<CartItem[]>([]);
//   private cart: CartItem[] = [];
//   cart$ = this.cartSubject.asObservable();
//
//   constructor() {}
//
//   addToCart(product:ProductType): void {
//     let quantity = 1;
//     const existingItem = this.cart.find(item => item.product.id === product.id);
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       this.cart.push({product:product ,quantity: quantity });
//     }
//     this.cartSubject.next([...this.cart]);
//   }
//
//   removeFromCart(productId: number): void {
//     this.cart = this.cart.filter(item => item.product.id !== productId);
//     this.cartSubject.next([...this.cart]);
//   }
//
//   updateQuantity(productId: number, quantity: number): void {
//     const item = this.cart.find(item => item.product.id === productId);
//     if (item) {
//       item.quantity = quantity;
//       this.cartSubject.next([...this.cart]);
//     }
//   }
//
//   getCart(): Observable<CartItem[]> {
//     return this.cartSubject.asObservable();
//   }
//
//   getCartTotal(): number {
//     return this.cart.reduce((total, item) => total + item.quantity, 0);
//   }
//
//   clearCart(): void {
//     this.cart = [];
//     this.cartSubject.next([]);
//   }
// }




import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/Cartitem.model';
import { ProductType } from '../models/Product.type';
import {CartDbService} from './cart-db-service.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cart: CartItem[] = [];
  cart$ = this.cartSubject.asObservable();

  constructor(private cartDb: CartDbService) {
    this.loadCartFromDb();
  }

  private async loadCartFromDb() {
    this.cart = await this.cartDb.getCartItems();
    this.cartSubject.next([...this.cart]);
  }

  async addToCart(product: ProductType): Promise<void> {
    let quantity = 1;
    const existingItem = this.cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartDb.updateItem(existingItem);
    } else {
      const newItem: CartItem = { product: product, quantity: quantity };
      this.cart.push(newItem);
      await this.cartDb.addItem(newItem);
    }

    this.cartSubject.next([...this.cart]);
  }

  async removeFromCart(productId: number): Promise<void> {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    await this.cartDb.removeItem(productId);
    this.cartSubject.next([...this.cart]);
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const item = this.cart.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      await this.cartDb.updateItem(item);
      this.cartSubject.next([...this.cart]);
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  async clearCart(): Promise<void> {
    this.cart = [];
    await this.cartDb.clearCart();
    this.cartSubject.next([]);
  }
}
