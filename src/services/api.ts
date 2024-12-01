import axios from "axios";
import { Room, AuthResponse, RoomResponse } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/login", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/register", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export const roomService = {
  getAllRooms: async (): Promise<RoomResponse[]> => {
    const response = await api.post<RoomResponse[]>("/rooms");
    return response.data;
  },

  getRoomAvailability: async (
    roomId: number,
    checkIn: Date,
    checkOut: Date
  ) => {
    const response = await api.get(`/rooms/${roomId}/availability`, {
      params: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
    });
    return response.data.available;
  },
};

export const bookingService = {
  createBooking: async (bookingData: {
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    guestName: string;
    guestEmail: string;
  }) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get("/bookings/user");
    return response.data;
  },
};
