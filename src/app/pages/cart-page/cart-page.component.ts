import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {OrderDialogComponent} from '../../components/order-dialog/order-dialog.component';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Order, OrderLocation, OrderContact, OrderProduct} from '../../models/order.model';
import {CartItem} from '../../models/Cartitem.model';
import {ProductType} from '../../models/Product.type';
import {RouterLink} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  totalAmount: number = 0;
  latitude: number | undefined;
  longitude: number | undefined;

  orderForm!: FormGroup;
  contacts!: FormArray;
  storeId: number = 7; // Default store ID


  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    // Initial subscription is handled in constructor
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      console.log(this.cartItems);
      this.calculateTotals();
    });

    this.initializeForm();
    this.storeId = this.storeId;
    this.getCurrentLocation()

  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      streetAddress2: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      // latitude: [this.latitude, Validators.required],
      // longitude: [this.longitude, Validators.required],
      contacts: this.fb.array([this.createContact()])
    });
    this.contacts = this.orderForm.get('contacts') as FormArray;
  }

  private createContact(): FormGroup {
    return this.fb.group({
      contactName: ['', Validators.required],
      contactValue: ['', Validators.required]
    });
  }

  addContact(): void {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number): void {
    if (index >= 0 && index < this.contacts.length) {
      this.contacts.removeAt(index);
    }
  }

  async onSubmit() {
    console.log("onSubmit");
    // if (this.orderForm.valid) {
      console.log("orderForm");
      const orderLocation: OrderLocation = {
        streetAddress2: this.orderForm.get('streetAddress2')?.value || '',
        buildingNumber: this.orderForm.get('buildingNumber')?.value  || 0,
        latitude: this.latitude || 0,
        longitude: this.longitude || 0
      };

      const orderContacts: OrderContact[] = this.contacts.value as OrderContact[];

      const order: Order = {
        storeId: this.storeId,
        orderProducts: this.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        orderLocation,
        orderContacts
      };

    console.log(order)
      this.checkoutService.createOrder(order).subscribe({
        next: () => {
          this.cartService.clearCart();
          // Show success message
        },
        error: (error) => {
          // Handle error
          console.log(error)
        }
      });

    // }
  }

  getCurrentLocation(): void {
    this.checkoutService.getCurrentLocation()
      .then(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);
      })
      .catch(error => {
        console.error('Error getting location:', error);
      });
  }

  calculateTotals(): void {
    this.totalQuantity = this.cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    this.totalAmount = this.cartItems.reduce((sum: number, item: CartItem) => sum + (item.quantity * item.product.salePrice), 0);
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
        storeId: 7
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
    const item = this.cartItems.find(i => i.product.id === productId);
    return item?.product.salePrice || 0;
  }

  getProductImage(product: ProductType): string {
    return product.productImages?.[0]?.imageUrl || 'https://placehold.co/270x270';
  }


  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.product.salePrice, 0);
  }


  async submitFormById(event: Event) {
    event.preventDefault(); // Stop page navigation
    const form = document.getElementById('orderForm') as HTMLFormElement;
    if (form) {
      form.requestSubmit(); // This triggers the form's ngSubmit
      await this.onSubmit()
    }
  }
}
