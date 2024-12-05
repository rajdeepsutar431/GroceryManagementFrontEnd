import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'; // Example service for products
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalSales: number = 0;
  totalOrders: number = 0;
  totalProductsSold: number = 0;
  recentOrders: any[] = [];
  lowStockProducts: any[] = [];
  orderColumns: string[] = ['orderId', 'orderAmount', 'orderStatus', 'placedAt'];

  constructor(private productService: ProductService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSalesOverview();
    this.fetchRecentOrders();
    this.fetchLowStockProducts();
  }

  fetchSalesOverview(): void {
    // Mock data or API call to fetch sales overview
    this.totalSales = 500000;
    this.totalOrders = 200;
    this.totalProductsSold = 1500;
  }

  fetchRecentOrders(): void {
    this.http.get<any[]>('http://localhost:8089/api/order/getAllOrders')
      .subscribe((orders) => {
        this.recentOrders = orders;
      });
  }

  fetchLowStockProducts(): void {
    // this.productService.getLowStockProducts().subscribe((products) => {
    //   this.lowStockProducts = products;
    // });
  }
}
