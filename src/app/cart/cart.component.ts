import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { CustomerStoreService } from '../services/customer-store.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

// Declare Razorpay as a global variable to avoid TypeScript issues
declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})


export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice: number = 0;
  packagingCharges: number = 50;  // Packaging charges (can be dynamic)
  gstAmount: number = 0;  // GST amount (5% assumed here)
  grandTotal: number = 0;  // Grand total
  address: string = ''; // Delivery address input field
  addressError: boolean = false; // To validate if delivery address is entered

  constructor(
    private cartService: CartService, 
    private router: Router,
    private customerStoreService: CustomerStoreService,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit(): void {
    // Subscribe to the cart items observable
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  // Calculate total price and other fees
  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate GST (5% of total price)
    this.gstAmount = this.totalPrice * 0.05;

    // Calculate grand total (Total price + Packaging + GST)
    this.grandTotal = this.totalPrice + this.packagingCharges + this.gstAmount;
  }

  // Method to increase quantity
  increaseQuantity(product: Product): void {
    const cartId = this.customerStoreService.getCartId();
    if (cartId !== null) {
      this.cartService.incrementItemQuantity(product.id).subscribe(() => {
        product.quantity++;
        this.calculateTotal();
      });
    } else {
      console.error('Cart ID is not available');
    }
  }

  // Method to decrease quantity
  decreaseQuantity(product: Product): void {
    if (product.quantity > 1) {
      const cartId = this.customerStoreService.getCartId();
      if (cartId !== null) {
        this.cartService.decrementItemQuantity(product.id).subscribe(() => {
          product.quantity--;
          this.calculateTotal();
        });
      } else {
        console.error('Cart ID is not available');
      }
    }
  }

  // Method to remove the item completely from the cart
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.calculateTotal();
  }

  // Method to validate delivery address
  validateAddress(): boolean {
    if (!this.address.trim()) {
      this.addressError = true;
      return false;
    } else {
      this.addressError = false;
      return true;
    }
  }

  // Razorpay Payment handler
  initiatePayment(): void {
    const totalAmountInPaise = Math.round(this.grandTotal * 100); // Convert amount to paise (1 INR = 100 paise)
    
    const options = {
      key: 'rzp_test_vv1FCZvuDRF6lQ',  // Replace this with your Razorpay API key
      amount: totalAmountInPaise,
      currency: 'INR',
      name: 'Groceria',
      description: 'Grocery Payment',
      handler: (response: any) => {
        //alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        
        // Call placeOrder or navigate to confirmation after payment
        this.completeOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#F37254'
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  // Complete the order after successful payment
  completeOrder(paymentId: string) {
    const orderDetails = {
        cartId: this.customerStoreService.getCartId(),
        customerId: this.customerStoreService.getCustomer()?.customerId,
        utrNumber: paymentId,
        deliveryAddress: this.address
    };

    // Call your backend API to save the order
    this.http.post('http://localhost:8089/api/order/create', orderDetails)
      .subscribe(
        (response: any) => {
          console.log('Order placed successfully:', response);
          
          // Navigate to the order confirmation page with order ID, delivery address, and ordered items
          this.router.navigate(['/order-confirmation'], { 
            state: { 
              orderId: response.id, 
              deliveryAddress: this.address,
              orderedItems: this.cartItems  // Pass the ordered items
            } 
          });
        },
        (error: any) => {
          console.error('Error placing order:', error);
        }
      );
}

  

  // Proceed to Payment
  proceedToPayment(): void {
    if (this.validateAddress()) {
      this.initiatePayment();  // Trigger the Razorpay payment if the address is valid
    } else {
      console.error('Delivery address is required.');
      alert('Please provide a valid delivery address before proceeding.');
    }
  }
}
