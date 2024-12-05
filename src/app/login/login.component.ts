import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CustomerStoreService } from '../services/customer-store.service';
import {jwtDecode} from 'jwt-decode'; // Make sure jwt-decode is imported correctly

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private customerStore: CustomerStoreService
  ) {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with required and email validators
      password: ['', [Validators.required]] // Password field with required validator
    });
  }

  onSubmit(): void {
    
    // Check if the form is valid before proceeding
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const username = email;

      console.log('Attempting login with:', { username, password }); // Log input values for debugging

      // Make an HTTP POST request to the authentication API
      this.http.post<{ token: string }>('http://localhost:8087/api/auth/login', { username, password })
        .subscribe(
          response => {
            console.log('Response received:', response); // Log the full response from the server

            const token = response.token;
            console.log('Token received:', token); // Log the token received from the server

            // Store the token in sessionStorage
            sessionStorage.setItem('token', token);

            // Decode the token to extract customer data
            try {
              const decodedToken: any = jwtDecode(token);
              console.log('Decoded token:', decodedToken); // Log the decoded token

              // Create a customer object from the decoded token
              const customer = {
                customerId: decodedToken.customerId, // Assuming the token contains a customerId
                name: decodedToken.name,             // Assuming the token contains a name
                role: decodedToken.role              // Assuming the token contains a role
              };

              console.log("Storing customer in service:", customer);
              this.customerStore.setCustomer(customer); // Store the customer info in CustomerStoreService

              // Navigate to the dashboard after successful login
              this.router.navigate(['/Dashboard']);
              window.location.reload(); // Reload the page to update any UI elements dependent on the login state
            } catch (error) {
              console.error('Error decoding token:', error); // Log any errors that occur during token decoding
            }
          },
          error => {
            console.error('Login error:', error); // Handle and log any errors that occur during the login process
          }
        );
    } else {
      console.log('Login form is invalid', this.loginForm.errors); // Log form errors if the form is invalid
    }
  }
}
