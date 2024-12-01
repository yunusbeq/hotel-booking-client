export interface Room {
  id: number;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  imageUrl: string;
  description: string;
}

export interface Reservation {
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
