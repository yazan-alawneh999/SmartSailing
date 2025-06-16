import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderDialogComponent} from '../../components/order-dialog/order-dialog.component';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Order, OrderLocation, OrderContact, OrderProduct} from '../../models/order.model';
import {CartItem} from '../../models/Cartitem.model';
import {ProductType} from '../../models/Product.type';
import {RouterLink} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';

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
  isSubmitting: boolean = false;

  orderForm!: FormGroup;
  contacts!: FormArray;
  storeId: number = 7; // Default store ID

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeCartSubscription();
    this.initializeForm();
    this.getCurrentLocation();
  }

  private initializeCartSubscription(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.calculateTotals();
    });
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      streetAddress2: ['', [Validators.required, Validators.minLength(3)]],
      buildingNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      contacts: this.fb.array([this.createContact()])
    });
    this.contacts = this.orderForm.get('contacts') as FormArray;
  }

  private createContact(): FormGroup {
    return this.fb.group({
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      contactValue: ['', [Validators.required, Validators.pattern('^[0-9+\\-() ]+$')]]
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
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      this.showNotification('Please fill in all required fields correctly', 'error');
      return;
    }

    if (this.cartItems.length === 0) {
      this.showNotification('Your cart is empty', 'error');
      return;
    }

    this.isSubmitting = true;
    const order = this.createOrderObject();

    this.checkoutService.createOrder(order)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.handleOrderSuccess();
        },
        error: (error) => {
          this.handleOrderError(error);
        }
      });
  }

  private createOrderObject(): Order {
    const orderLocation: OrderLocation = {
      streetAddress2: this.orderForm.get('streetAddress2')?.value || '',
      buildingNumber: this.orderForm.get('buildingNumber')?.value || 0,
      latitude: this.latitude || 0,
      longitude: this.longitude || 0
    };

    return {
      storeId: this.storeId,
      orderProducts: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      orderLocation,
      orderContacts: this.contacts.value as OrderContact[]
    };
  }

  private handleOrderSuccess(): void {
    this.cartService.clearCart();
    this.orderForm.reset();
    this.contacts.clear();
    this.contacts.push(this.createContact());
    this.showNotification('Order placed successfully!', 'success');
  }

  private handleOrderError(error: any): void {
    console.error('Order creation failed:', error);
    this.showNotification('Failed to place order. Please try again.', 'error');
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
    this.totalAmount = this.getTotal();
  }

  updateQuantity(productId: number, quantity: string | number): void {
    const numericQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
    
    if (!isNaN(numericQuantity) && numericQuantity > 0) {
      this.cartService.updateQuantity(productId, numericQuantity);
      this.calculateTotals(); // Recalculate totals after quantity update
    } else {
      // Reset to previous quantity if invalid input
      const item = this.cartItems.find(i => i.product.id === productId);
      if (item) {
        this.cartService.updateQuantity(productId, item.quantity);
      }
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.calculateTotals(); // Recalculate totals after removal
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

  getProductTotal(productId: number): number {
    const item = this.cartItems.find(i => i.product.id === productId);
    return item ? item.quantity * item.product.salePrice : 0;
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.quantity * item.product.salePrice), 0);
  }

  getSubtotal(): number {
    return this.getTotal();
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
