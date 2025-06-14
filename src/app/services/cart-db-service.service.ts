// cart-db.service.ts
import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { CartItem } from '../models/Cartitem.model';

@Injectable({
  providedIn: 'root'
})
export class CartDbService extends Dexie {
  cart!: Table<CartItem, number>;

  constructor() {
    super('CartDatabase');
    this.version(1).stores({
      cart: 'product.id' // Primary key is product.id
    });
  }

  async getCartItems(): Promise<CartItem[]> {
    return this.cart.toArray();
  }

  async addItem(item: CartItem): Promise<void> {
    await this.cart.put(item);
  }

  async updateItem(item: CartItem): Promise<void> {
    await this.cart.put(item);
  }

  async removeItem(productId: number): Promise<void> {
    await this.cart.delete(productId);
  }

  async clearCart(): Promise<void> {
    await this.cart.clear();
  }
}
