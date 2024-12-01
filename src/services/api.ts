import axios from "axios";
import {
  Room,
  User,
  Booking,
  CreateBookingDto,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/types";

export const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
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
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/login", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/register", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/logout");
    localStorage.removeItem("token");
  },

  checkAuth: async (): Promise<{ data: User; message: string }> => {
    const response = await api.get("/auth/check");
    return response.data;
  },
};

export const roomService = {
  getAllRooms: async (): Promise<{ data: Room[]; message: string }> => {
    const response = await api.get("/rooms");
    return response.data;
  },

  getRoomById: async (
    roomId: string
  ): Promise<{ data: Room; message: string }> => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  getAvailableRooms: async (params: {
    startDate: string;
    endDate: string;
  }): Promise<{ data: Room[]; message: string }> => {
    const response = await api.get("/rooms/available", { params });
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (
    bookingData: CreateBookingDto
  ): Promise<{ data: Booking; message: string }> => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  getUserBookings: async (): Promise<{ data: Booking[]; message: string }> => {
    const response = await api.get("/bookings");
    return response.data;
  },

  getBookingById: async (
    bookingId: string
  ): Promise<{ data: Booking; message: string }> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (
    bookingId: string,
    cancellationReason: string
  ): Promise<{ data: Booking; message: string }> => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      cancellationReason,
    });
    return response.data;
  },
};

export type ApiResponse<T> = {
  data: T;
  message: string;
};
