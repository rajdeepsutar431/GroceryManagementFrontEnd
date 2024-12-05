import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  orderId: number;
  orderItems: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) {
    this.orderId = this.route.snapshot.params['orderId'];
  }

  ngOnInit(): void {
    this.fetchOrderItems();
  }

  fetchOrderItems(): void {
    this.http.get<any[]>(`http://localhost:8089/api/order/getAllOrderItems/${this.orderId}`)
      .subscribe(
        (response: any[]) => {
          this.orderItems = response;
          console.log('Order items fetched successfully:', this.orderItems);
        },
        (error: any) => {
          console.error('Error fetching order items:', error);
        }
      );
  }

  // Method to navigate back to the previous page
  goBack(): void {
    this.location.back();
  }
}
