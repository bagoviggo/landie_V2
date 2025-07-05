// Flat type for SQL result mapping for Property
export type PropertyRow = {
  propertyId: string;
  title: string;
  description: string;
  "location.address": string;
  "location.latitude": number;
  "location.longitude": number;
  price: number;
  type: string;
  size: number;
  amenities: string;
  images: string;
  createdAt: string;
  updatedAt: string;
};

// Flat type for SQL result mapping for Lease
export type LeaseRow = {
  leaseId: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  paymentFrequency: string;
  createdAt: string;
  updatedAt: string;
};
// Core data models for the Property Management System (PMS)

export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  role: 'landlord' | 'tenant' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  propertyId: string;
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  type: string;
  size: number;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}



export interface Lease {
  leaseId: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  paymentFrequency: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface MaintenanceRequest {
  requestId: string;
  propertyId: string;
  tenantId: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  reviewId: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

