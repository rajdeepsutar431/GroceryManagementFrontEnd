export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    rating: number;
    imageUrl: string;
    categoryIds: number[]; // Ensure categoryIds is an array of numbers
    quantity: number; // Optional field to track quantity in the cart
  }
  