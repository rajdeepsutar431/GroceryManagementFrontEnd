import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CustomerStoreService } from './customer-store.service'; // Import CustomerStoreService

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Product[]>([]); // BehaviorSubject to track cart items
  cartItems$ = this.cartItemsSubject.asObservable();
  private apiUrl = 'http://localhost:8086/api/cart'; // Replace with your backend API URL

  constructor(private http: HttpClient, private customerStoreService: CustomerStoreService) {}

  // Method to add a product to the cart
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.getValue();
    const existingProduct = currentItems.find(item => item.id === product.id);

    if (existingProduct) {
      // If the product already exists in the cart, increase its quantity
      existingProduct.quantity += 1;
    } else {
      // If the product doesn't exist, add it with an initial quantity of 1
      product.quantity = 1; // Set initial quantity
      currentItems.push(product);
    }

    this.cartItemsSubject.next(currentItems); // Emit the updated cart items
  }

  // Method to remove a product from the cart (or decrease its quantity)
  removeFromCart(productId: number): void {
    let currentItems = this.cartItemsSubject.getValue();
    const product = currentItems.find(item => item.id === productId);

    if (product) {
      if (product.quantity > 1) {
        // Decrease quantity if it's greater than 1
        product.quantity -= 1;
      } else {
        // Remove product from the cart if quantity becomes 0
        currentItems = currentItems.filter(item => item.id !== productId);
      }
      this.cartItemsSubject.next(currentItems); // Emit the updated cart items
    }
  }

  // Method to sync the product quantities with the cart
  syncProductQuantity(products: Product[]): void {
    const cartItems = this.cartItemsSubject.getValue();
    products.forEach(product => {
      const cartItem= cartItems.find(item => item.id === product.id);
      if (cartItem) {
        // Sync the quantity fr om cart to the product list
        product.quantity = cartItem.quantity;
      } else {
        // If the product is not in the cart, set quantity to 0 or any default value
        product.quantity = 0;
      }
    });                                                                                                                                                                                                    

    this.cartItemsSubject.next(cartItems); // Emit the updated cart items after syncing
  }

  // API call to increment item quantity
  incrementItemQuantity(productId: number): Observable<any> {
    const cartId = this.customerStoreService.getCartId();
    if (cartId === null) {
      throw new Error('Cart ID is not available');
    }
    // Send PUT request to increment the item quantity in the cart
    return this.http.put(`${this.apiUrl}/incrementItemQty/${productId}/${cartId}`, {});
  }

  // API call to decrement item quantity
  decrementItemQuantity(productId: number): Observable<any> {
    const cartId = this.customerStoreService.getCartId();
    console.log("decrement item quantity for product id " + productId);
    if (cartId === null) {
      throw new Error('Cart ID is not available');
    }
    // Send PUT request to decrement the item quantity in the cart
    return this.http.put(`${this.apiUrl}/decrementItemQty/${productId}/${cartId}`, {});
  }

  // Get cart items as an observable
  getCartItems(): Observable<Product[]> {
    return this.cartItems$; // Return the cart items as an observable
  }

  clearCart(): void {
    this.cartItemsSubject.next([]); // Emit an empty array to clear the cart
  }
}
