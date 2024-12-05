import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerStoreService } from '../services/customer-store.service';
import { Router } from '@angular/router';

interface Order {
  orderId: number;
  totalAmount: number;
  totalItemQuantity: number;
  placedAt: string;
  orderStatus: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private http: HttpClient,
    private customerStoreService: CustomerStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const customerId = this.customerStoreService.getCustomer()?.customerId;
    if (customerId) {
      this.http.get<Order[]>(`http://localhost:8089/api/order/getAllOrders/${customerId}`)
        .subscribe(
          (response) => {
            // Sort orders in descending order of placement time
            this.orders = response.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
          },
          (error) => {
            console.error('Error fetching orders:', error);
          }
        );
    } else {
      console.error('Customer ID not found.');
    }
  }

  // Method to track order
  trackOrder(orderId: number): void {
    alert(`Tracking order with ID: ${orderId}`); // Replace with actual tracking functionality
  }

  // Method to view order items
  viewOrderItems(orderId: number): void {
    // Navigate to the order details page, if implemented
    this.router.navigate(['/order-items', orderId]);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'status-placed';
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  
}
