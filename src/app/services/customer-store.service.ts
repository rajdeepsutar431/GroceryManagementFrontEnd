import { Injectable } from '@angular/core';
import { Customer } from '../models/customer'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class CustomerStoreService {
  
  private customer: Customer | null = null; // Store customer data

  constructor() {}

  // Method to set customer data
  setCustomer(customer: Customer): void {
    this.customer = customer;
    console.log('Customer set:', this.customer); // Log to confirm the customer is set
  }
  
  // Method to get customer data
  getCustomer(): Customer | null {
    return this.customer;
  }

  // Optional: Method to clear customer data
  clearCustomer(): void {
    this.customer = null;
  }

  getCartId(): number | null {
    return this.customer && this.customer.cartId !== undefined ? this.customer.cartId : null;
  }
}
