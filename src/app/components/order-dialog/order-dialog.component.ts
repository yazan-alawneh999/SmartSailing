import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent} from '@angular/material/dialog';
import { OrderLocation, OrderContact, Order, OrderProduct } from '../../models/order.model';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {CheckoutService} from '../../services/checkout.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  imports: [
    MatIcon,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatDialogActions,
    MatButton,
    MatInput,
    NgForOf,
    MatDialogContent,
    MatIconButton,
    NgIf
  ],
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  orderForm!: FormGroup;
  contacts!: FormArray;
  storeId: number = 7; // Default store ID
  latitude: number | undefined;
  longitude: number | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cartItems?: OrderProduct[], storeId?: number } = {},
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    private checkoutService: CheckoutService
  ) {
    this.initializeForm();
    this.storeId = data.storeId || this.storeId;
  }

  ngOnInit(): void {
    // Initial form initialization is handled in constructor
  }


   getCurrentLocation():void {
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


  private initializeForm(): void {
    this.orderForm = this.fb.group({
      streetAddress2: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
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

  onSubmit(): void {


    if (this.orderForm.valid) {

      const orderLocation: OrderLocation = {
        streetAddress2: this.orderForm.get('streetAddress2')?.value || '',
        buildingNumber: parseInt(this.orderForm.get('buildingNumber')?.value as string) || 0,
        latitude: parseFloat(this.orderForm.get('latitude')?.value as string) || 0,
        longitude: parseFloat(this.orderForm.get('longitude')?.value as string) || 0
      };

      const orderContacts: OrderContact[] = this.contacts.value as OrderContact[];

      const order: Order = {
        storeId: this.storeId,
        orderProducts: this.data.cartItems || [],
        orderLocation,
        orderContacts
      };

      this.dialogRef.close(order);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


}
