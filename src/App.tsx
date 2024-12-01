import { useState } from "react";
import RoomList from "./components/RoomList";
import ReservationForm from "./components/ReservationForm";
import AuthForm from "./components/AuthForm";
import { Room, User, AuthMode } from "./types/types";
import "./App.css";

function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleAuth = (userData: User) => {
    console.log(`${authMode} successful:`, userData);
    setUser(userData);
    setShowAuthForm(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRoom(null);
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
              <span>Welcome, {user.email}</span>
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
            <RoomList onRoomSelect={handleBooking} />
            {selectedRoom && user && (
              <ReservationForm
                room={selectedRoom}
                onReservationComplete={() => setSelectedRoom(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
