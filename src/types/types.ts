export interface Room {
  id: number;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  imageUrl: string;
  description: string;
}

export interface Booking {
  id: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
}

export interface User {
  email: string;
  password: string;
}

export type AuthMode = "login" | "register";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RoomResponse extends Room {
  status?: string;
}

export interface BookingResponse {
  id: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  status: string;
  totalPrice: number;
}
