import { useEffect, useState } from "react";
import { Room } from "../types/types";
import { roomService } from "../services/api";

interface RoomListProps {
  onRoomSelect: (room: Room) => void;
}

function RoomList({ onRoomSelect }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.imageUrl} alt={room.type} />
            <div className="room-info">
              <h3>{room.type}</h3>
              <p className="price">${room.price} / night</p>
              <p className="capacity">Capacity: {room.capacity} persons</p>
              <p className="description">{room.description}</p>
              <button
                onClick={() => onRoomSelect(room)}
                className="reserve-button"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;
