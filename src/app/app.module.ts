import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartAppComponent } from './cart-app/cart-app.component';
import { DemoComponent } from './component/demo/demo.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule

import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule

// Importing Angular Material modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import Checkbox module
import { MatTableModule } from '@angular/material/table';
import { CartComponent } from './cart/cart.component';
import { CustomerStoreService } from './services/customer-store.service';
import { PaymentComponent } from './payment/payment.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; // Adjust the path as necessary

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    CartAppComponent,
    DemoComponent,
    HomeComponent,
    HeaderComponent,
    NavbarComponent,
    ProductsComponent,
    LoginComponent,
    CartComponent,
    PaymentComponent,
    OrderConfirmationComponent,
    OrdersComponent,
    OrderItemsComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    BrowserAnimationsModule,  // Required for Angular Material
    MatDialogModule,  // Import MatDialogModule for modal dialogs
    MatCardModule,  // Import Angular Material Card module
    MatFormFieldModule,  // Import Angular Material Form Field module
    MatInputModule,  // Import Angular Material Input module
    ReactiveFormsModule,  // Import ReactiveFormsModule for form handling
    MatButtonModule,  // Import Angular Material Button module
    MatIconModule,  // Import Angular Material Icon module
    MatCheckboxModule, // Import Angular Material Checkbox module
    // You can add any other Material modules that you need
  ],
  providers: [CustomerStoreService],  // Include the CustomerStoreService if applicable
  bootstrap: [AppComponent]
})
export class AppModule { }
