import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderProduct } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<OrderProduct[]>([]);
  private cart: OrderProduct[] = [];
  cart$ = this.cartSubject.asObservable();

  constructor() {}

  addToCart(productId: number, quantity: number = 1, price: number): void {
    const existingItem = this.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ productId, quantity, price });
    }
    this.cartSubject.next([...this.cart]);
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.cartSubject.next([...this.cart]);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next([...this.cart]);
    }
  }

  getCart(): Observable<OrderProduct[]> {
    return this.cartSubject.asObservable();
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cart = [];
    this.cartSubject.next([]);
  }
}
