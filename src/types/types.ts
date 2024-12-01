import { ObjectId } from "mongodb";

// Enum tanımlamaları
export enum RoomType {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  SUITE = "SUITE",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
}

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

// Interface tanımlamaları
export interface Room {
  _id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  isAvailable: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  _id: string;
  roomId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  cancellationDeadline: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO (Data Transfer Object) tanımlamaları
export interface CreateBookingDto {
  roomId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

export interface CancelBookingDto {
  cancellationReason: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

// Auth ile ilgili tipler
export type AuthMode = "login" | "register";

export interface AuthResponse {
  data: User;
  message: string;
  token: string;
}

// API yanıt tipleri
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface RoomAvailabilityDto {
  startDate: string;
  endDate: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role: UserRole;
}
