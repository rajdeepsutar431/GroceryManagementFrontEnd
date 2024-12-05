import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit, AfterViewInit {
  orderedItems: Product[] = [];
  totalPrice: number = 0;
  packagingCharges: number = 50;
  gstAmount: number = 0;
  grandTotal: number = 0;
  deliveryAddress: string = '';
  orderId: string = '';

  constructor(private cartService: CartService, private router: Router) {
    // Retrieve the order ID, address, and ordered items passed through the router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['orderId']) {
      this.orderId = navigation.extras.state['orderId'];
    }
    if (navigation?.extras?.state?.['deliveryAddress']) {
      this.deliveryAddress = navigation.extras.state['deliveryAddress'];
    }
    if (navigation?.extras?.state?.['orderedItems']) {
      this.orderedItems = navigation.extras.state['orderedItems'];
    } else {
      console.error('No ordered items found');
    }
  }

  ngOnInit(): void {
    this.calculateTotals();
  }

  ngAfterViewInit(): void {
    // Clear the cart after the component has fully rendered
    setTimeout(() => {
      this.cartService.clearCart();
    }, 0);
  }

  calculateTotals(): void {
    this.totalPrice = this.orderedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.gstAmount = this.totalPrice * 0.05;
    this.grandTotal = this.totalPrice + this.packagingCharges + this.gstAmount;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
