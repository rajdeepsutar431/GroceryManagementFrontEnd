// src/app/models/customer.ts
export interface Customer {
    customerId: string;
    name: string;
    role: string;
    cartId?: number; // Add the cartId property (optional)

  }
  