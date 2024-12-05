import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component'; // Import ProductsComponent
import { LoginComponent } from './login/login.component'; // Import LoginComponent
import { CartComponent } from './cart/cart.component'; // Import CartComponent
import { PaymentComponent } from './payment/payment.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrdersComponent } from './orders/orders.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OrderItemsComponent } from './order-items/order-items.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route

  { path: 'orders', component: OrdersComponent },

  { path: 'login', component: LoginComponent }, // Login route
  { path: 'order-confirmation', component: OrderConfirmationComponent }, // Order confirmation
  { path: 'products', component: ProductsComponent }, // Products route
  { path: 'cart', component: CartComponent }, // Cart route
  { path: 'payment', component: PaymentComponent },
  { path: 'order-items/:orderId', component: OrderItemsComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  { path: '**', redirectTo: '' } // Wildcard route to redirect to home if no match
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
