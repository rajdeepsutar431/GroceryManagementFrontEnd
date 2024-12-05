import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service'; // Import CartService
import { CustomerStoreService } from '../services/customer-store.service'; // Import CustomerStoreService

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  address: string = 'Airoli';  // Initial value set to an empty string
  utrNumber: string = ''; // UTR number or transaction reference
  totalAmount: number = 0; // Total amount to be displayed on payment page
  cartId: number | null = null;
  customerId: number | null = null;
  addressError: boolean = false;  // To check if address is missing
  utrNumberError: boolean = false; // To check if UTR number is missing

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cartService: CartService, 
    private customerStoreService: CustomerStoreService
  ) {}

  ngOnInit(): void {
    // Retrieve cart and customer data from services
    const customer = this.customerStoreService.getCustomer();
    if (customer) {
      this.customerId = +customer.customerId; // Convert customerId to number
      this.cartId = this.customerStoreService.getCartId();
    }

    // Get the passed address from navigation state
    const navigation = this.router.getCurrentNavigation();
    console.log("Navigation State:", navigation?.extras?.state);
    if (navigation?.extras?.state?.['address']) {
      this.address = navigation.extras.state['address']; // Set the address using bracket notation
      console.log("Received address from state:", this.address);
    } else {
      console.error("No address found in navigation state.");
    }

    // Calculate total amount based on cart items
    this.cartService.getCartItems().subscribe(cartItems => {
      this.totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      console.log("Total Amount:", this.totalAmount);
    });
  }

  // Method to validate if all required fields are provided
  validateInputs(): boolean {
    this.addressError = !this.address.trim(); // Check if the address is empty
    this.utrNumberError = !this.utrNumber.trim(); // Check if UTR number is empty
    return !this.addressError && !this.utrNumberError; // Return true if all inputs are valid
  }

  // Method to handle order placement
  placeOrder() {
    if (this.validateInputs() && this.cartId && this.customerId) {
      // Create the order object as per the OrderDto structure
      const orderDto = {
        cartId: this.cartId,
        customerId: this.customerId,
        utrNumber: this.utrNumber,
        deliveryAddress: this.address
      };

      console.log("Order DTO:", orderDto);

      // Make the POST request to the backend API
      this.http.post('http://localhost:8089/api/order/create', orderDto)
        .subscribe(
          (response) => {
            console.log("Order placed successfully:", response);
            // Redirect to confirmation page or show success message
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error("Error placing the order:", error);
            // Handle error and display to user
            alert('Error placing order, please try again.');
          }
        );
    } else {
      // Display error messages if inputs are invalid
      if (this.addressError) {
        alert("Please enter a valid delivery address.");
      }
      if (this.utrNumberError) {
        alert("Please enter a valid UTR number.");
      }
    }
  }

  editPayment(): void {
    // Implement any action required for editing the payment methods or details
    alert('Edit payment details');
  }
}
