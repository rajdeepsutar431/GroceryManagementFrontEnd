import { Component, OnInit, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categorizedProducts: any[] = []; // To store products category-wise

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public dialog: MatDialog,
    private elRef: ElementRef // Added to access DOM elements for sliding
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data.map(product => ({
          ...product,
          quantity: 0,
          price: product.price - product.discount
        }));
        this.categorizeProducts(); // Categorize the products
        this.cartService.syncProductQuantity(this.products);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  categorizeProducts(): void {
    // Define a Map to group products by category
    const categoryMap = new Map<number, { name: string; products: Product[]; showMore: boolean }>();

    this.products.forEach((product) => {
      product.categoryIds.forEach((categoryId: number) => {  // Ensure categoryId is a number
        // If category doesn't exist in the map, initialize it
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            name: this.getCategoryNameById(categoryId), // Get the category name using categoryId
            products: [],
            showMore: false // Initial state for 'Show More' functionality
          });
        }

        // Safely add the product to the corresponding category
        categoryMap.get(categoryId)?.products.push(product);
      });
    });

    // Convert the map values to an array and store them in categorizedProducts
    this.categorizedProducts = Array.from(categoryMap.values());
  }

  getCategoryNameById(categoryId: number): string {
    const categoryNames: { [key: string]: string } = {
      '1': 'Fruits & Vegetables',
      '2': 'Dairy & Eggs',
      '3': 'Bakery',
      '4': 'Beverages',
      '5': 'Grains & Pasta',
      '6': 'Cleaning Supplies',
      '7': 'Personal Care',
      '8': 'Baby Products',
      '9': 'Pet Supplies'
    };

    // Convert the categoryId to string before accessing the object
    return categoryNames[categoryId.toString()] || 'Unknown';
  }

  // Updated slideLeft and slideRight methods to work with specific categories
  slideLeft(categoryIndex: number): void {
    const productSlider = this.elRef.nativeElement.querySelectorAll('.product-slider')[categoryIndex];
    productSlider.scrollLeft -= 300; // Adjust scroll distance as needed
  }

  slideRight(categoryIndex: number): void {
    const productSlider = this.elRef.nativeElement.querySelectorAll('.product-slider')[categoryIndex];
    productSlider.scrollLeft += 300; // Adjust scroll distance as needed
  }

  addToCart(product: Product): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.cartService.addToCart(product);
      product.quantity = 1;
    } else {
      this.goToLogin();
    }
  }

  goToLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The login dialog was closed');
    });
  }

  increaseQuantity(product: Product): void {
    this.cartService.addToCart(product);
    this.cartService.syncProductQuantity(this.products);
  }

  decreaseQuantity(product: Product): void {
    if (product.quantity > 0) {
      this.cartService.removeFromCart(product.id);
      this.cartService.syncProductQuantity(this.products);
    }
  }
}
