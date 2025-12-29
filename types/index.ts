export interface Vehicle {
  id: number
  name: string
  make: string
  model: string
  year: number
  price: string
  status: "Available" | "Shipped" | "Not Available"
  image: string
  location: string
  branch: string
  mileage?: number
  fuelType?: string
  transmission?: string
  engineCapacity?: string
  color?: string
  description?: string
}

export interface Consultation {
  id: number
  name: string
  email: string
  phone: string
  vehicleType: string
  consultationType: string
  preferredDate: string
  preferredTime: string
  message?: string
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
}

export interface Appointment {
  id: number
  userId: number
  vehicleId: number
  date: string
  time: string
  status: "Scheduled" | "Completed" | "Cancelled"
  type: "Test Drive" | "Consultation" | "Purchase"
}

export interface Review {
  id: number
  userId: number
  vehicleId?: number
  rating: number
  comment: string
  date: string
  userName: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "customer" | "admin"
  createdAt: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface NewsletterSubscription {
  id: number
  email: string
  subscribedAt: string
  active: boolean
}

export interface Branch {
  id: number
  name: string
  location: string
  phone: string
  vehicleCount: number
}

export type NewsletterBroadcast = {
  id: string;
  title: string;
  message: string;
  sentAt: string | null;
  createdAt: string;
};
