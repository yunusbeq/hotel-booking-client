import { useState, useEffect } from "react";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import AuthForm from "./components/AuthForm";
import { Room, User, AuthMode, UserRole } from "./types/types";
import { authService } from "./services/api";
import "./App.css";

function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [error, setError] = useState<string>("");

  // Sayfa yüklendiğinde cookie kontrolü
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Backend'den user bilgisini al
        const response = await authService.checkAuth();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuth = async (userData: { email: string; password: string }) => {
    try {
      setError("");
      const response = await (authMode === "login"
        ? authService.login(userData)
        : authService.register({
            ...userData,
            role: UserRole.CUSTOMER, // Yeni kullanıcılar için varsayılan rol
          }));

      setUser(response.data);
      setShowAuthForm(false);
    } catch (error: unknown) {
      console.error("Authentication failed:", error);
      if (error instanceof Error) {
        setError(error.message || "Authentication failed. Please try again.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleBooking = (room: Room) => {
    if (!user) {
      setShowAuthForm(true);
    } else {
      setSelectedRoom(room);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Hotel Reservation System</h1>
        <div className="user-info">
          {user ? (
            <>
              <span>
                Welcome, {user.email}
                {user.role === UserRole.ADMIN && " (Admin)"}
              </span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-button"
              onClick={() => setShowAuthForm(true)}
            >
              Login / Register
            </button>
          )}
        </div>
      </header>
      <main>
        {error && <div className="error-message">{error}</div>}
        {showAuthForm ? (
          <AuthForm
            mode={authMode}
            onSubmit={handleAuth}
            onToggleMode={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          />
        ) : (
          <>
            <RoomList
              onRoomSelect={handleBooking}
              isAdmin={user?.role === UserRole.ADMIN}
            />
            {selectedRoom && user && (
              <BookingForm
                room={selectedRoom}
                onBookingComplete={() => setSelectedRoom(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
