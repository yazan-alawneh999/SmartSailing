import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderDialogComponent } from '../../components/order-dialog/order-dialog.component';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Order, OrderLocation, OrderContact, OrderProduct } from '../../models/order.model';

@Component({
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cartItems: OrderProduct[] = [];
  totalQuantity: number = 0;
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog
  ) {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.calculateTotals();
    });
  }

  ngOnInit(): void {
    // Initial subscription is handled in constructor
  }

  calculateTotals(): void {
    this.totalQuantity = this.cartItems.reduce((sum: number, item: OrderProduct) => sum + item.quantity, 0);
    this.totalAmount = this.cartItems.reduce((sum: number, item: OrderProduct) => sum + (item.quantity * item.price), 0);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '500px',
      data: {
        cartItems: this.cartItems,
        storeId: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const order: Order = {
          storeId: result.storeId,
          orderProducts: result.orderProducts,
          orderLocation: result.orderLocation,
          orderContacts: result.orderContacts
        };

        this.checkoutService.createOrder(order).subscribe({
          next: () => {
            this.cartService.clearCart();
            // Show success message
          },
          error: (error) => {
            // Handle error
          }
        });
      }
    });
  }

  getProductPrice(productId: number): number {
    const item = this.cartItems.find(i => i.productId === productId);
    return item?.price || 0;
  }

}
