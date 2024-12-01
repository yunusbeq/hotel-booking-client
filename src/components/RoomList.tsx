import { useEffect, useState } from "react";
import { Room, RoomType } from "../types/types";
import { roomService, API_URL } from "../services/api";

interface RoomListProps {
  onRoomSelect: (room: Room) => void;
  isAdmin: boolean;
}

function RoomList({ onRoomSelect, isAdmin }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch rooms...");

      const response = await roomService.getAllRooms();
      console.log("Rooms loaded successfully:", response);
      setRooms(response.data);
    } catch (error: unknown) {
      console.error("Failed to load rooms. Details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        response:
          error instanceof Error && "response" in error
            ? (error as any).response
            : null,
        status:
          error instanceof Error && "response" in error
            ? (error as any).response?.status
            : null,
      });

      if (error instanceof Error) {
        setError(
          error.message || "Failed to load rooms. Please try again later."
        );
      } else {
        setError("Failed to load rooms. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoomTypeLabel = (type: RoomType): string => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={loadRooms} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return <div className="no-rooms">No rooms available.</div>;
  }

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <div className="room-info">
              <h3>
                Room {room.roomNumber} - {getRoomTypeLabel(room.type)}
              </h3>
              <p className="price">${room.price} / night</p>
              {room.description && (
                <p className="description">{room.description}</p>
              )}
              <p className="status">
                Status: {room.isAvailable ? "Available" : "Not Available"}
              </p>
              <button
                onClick={() => onRoomSelect(room)}
                className="reserve-button"
                disabled={!room.isAvailable}
              >
                {room.isAvailable ? "Book Now" : "Not Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;
