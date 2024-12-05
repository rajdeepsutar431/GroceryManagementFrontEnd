import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerStoreService } from '../services/customer-store.service'; // Import CustomerStoreService
import {jwtDecode} from 'jwt-decode'; // Correctly import jwtDecode

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;  // Variable to hold the total cart item count
  private cartSubscription: Subscription | undefined;  // Subscription to cart updates
  isLoggedIn: boolean = false; // To track login status


  constructor(
    private router: Router, 
    public dialog: MatDialog, 
    private cartService: CartService,
    private http: HttpClient, // Inject HttpClient
    private customerStoreService: CustomerStoreService // Inject CustomerStoreService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in (token is present)
    this.checkLoginStatus();

    // Subscribe to cart items observable to get updates on the cart item count
    this.cartSubscription = this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((total, item) => total + 1, 0);  // Calculate total quantity of products in the cart
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();  // Unsubscribe to prevent memory leaks
    }
  }

  // Check login status based on token presence in sessionStorage
  checkLoginStatus(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token in HeaderComponent:', decodedToken);

        const customer = {
          customerId: decodedToken.customerId,
          name: decodedToken.name,
          role: decodedToken.role
        };
        this.customerStoreService.setCustomer(customer);
        console.log('Customer set in HeaderComponent:', customer);

      } catch (error) {
        console.error('Error decoding token in HeaderComponent:', error);
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  goToCart(): void {

    const customer = this.customerStoreService.getCustomer();

    
    if (customer && customer.customerId) {
      this.cartService.getCartItems().subscribe(cartItems => {
        if (cartItems.length > 0) {
          // Transform the cart items to the expected format

          console.log("items indide cart items: " + JSON.stringify(cartItems));

          const transformedCartItems = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }));
  
          const url = `http://localhost:8086/api/cart/createCart/${customer.customerId}`; // Correct endpoint
  
          // Send POST request with the transformed list of cartItems
          this.http.post(url, transformedCartItems).subscribe(
            (response: any) => {
              console.log('Cart created successfully:', response);
              if (response && response.id) {
                // Store the cartId in the CustomerStoreService
                this.customerStoreService.setCustomer({
                  ...customer,
                  cartId: response.id // Assuming cartId is part of the response
                });
                console.log("printing the response", response.data);
                this.router.navigate(['/cart']);

              }
            },
            (error) => {
              console.error('Error creating cart:', error);
            }
          );
        } 
        else {
          console.log("Your cart is empty!");
        }
      });
    } else {
      alert("No customer information available!");
    }
  }

    // Method to navigate to the orders page
    viewMyOrders(): void {
      const customerId = this.customerStoreService.getCustomer()?.customerId;
      if (customerId) {
        // Navigate to the orders component with the customer ID as a parameter
        this.router.navigate(['/orders']);
      } else {
        console.error('Customer ID not available. Please log in first.');
        alert('Please log in to view your orders.');
      }
    }

  goToLogin(): void {
    // Open the login modal
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',   // Width of the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The login dialog was closed');
      // Check login status again when dialog closes
      this.checkLoginStatus();  
    });
  }

  goToHome(): void {   
    this.router.navigate(['/']);  // Redirect to home or login page
  }


  logout(): void {
    // Remove token from sessionStorage to log out
    sessionStorage.removeItem('token');
    this.isLoggedIn = false;  // Set login status to false
    this.router.navigate(['/']);  // Redirect to home or login page
    window.location.reload();  // Reload to update header after logout
  }
}
