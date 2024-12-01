import { Room } from "../types/types";

interface RoomListProps {
  onRoomSelect: (room: Room) => void;
}

const mockRooms: Room[] = [
  {
    id: 1,
    type: "Basic Room",
    price: 100,
    capacity: 2,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    description:
      "Perfect for solo travelers or couples. Includes basic amenities.",
  },
  {
    id: 2,
    type: "Premium Room",
    price: 200,
    capacity: 3,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    description: "Spacious room with premium amenities and city view.",
  },
  {
    id: 3,
    type: "Suite",
    price: 350,
    capacity: 4,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    description: "Luxury suite with separate living area and premium services.",
  },
];

function RoomList({ onRoomSelect }: RoomListProps) {
  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms-grid">
        {mockRooms.map((room) => (
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
