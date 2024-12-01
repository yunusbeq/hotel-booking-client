import { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import { Room } from "../types/types";
import "react-datepicker/dist/react-datepicker.css";

interface ReservationFormProps {
  room: Room;
  onReservationComplete: () => void;
}

function ReservationForm({
  room,
  onReservationComplete,
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    checkIn: null as Date | null,
    checkOut: null as Date | null,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    console.log("Reservation completed:", {
      ...formData,
      roomId: room.id,
      totalPrice: calculateTotalPrice(),
    });
    onReservationComplete();
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const days = Math.ceil(
      (formData.checkOut.getTime() - formData.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days * room.price;
  };

  return (
    <div className="reservation-form">
      <h2>Reservation Form - {room.type}</h2>
      <div className="room-summary">
        <p>Price per night: ${room.price}</p>
        <p>Maximum capacity: {room.capacity} persons</p>
        {formData.checkIn && formData.checkOut && (
          <p className="total-price">
            Total Price: ${calculateTotalPrice()}
            <span className="days">
              (
              {Math.ceil(
                (formData.checkOut.getTime() - formData.checkIn.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              nights)
            </span>
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guestName">Full Name:</label>
          <input
            type="text"
            id="guestName"
            value={formData.guestName}
            onChange={(e) =>
              setFormData({ ...formData, guestName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guestEmail">Email:</label>
          <input
            type="email"
            id="guestEmail"
            value={formData.guestEmail}
            onChange={(e) =>
              setFormData({ ...formData, guestEmail: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Check-in Date:</label>
          <DatePicker
            selected={formData.checkIn}
            onChange={(date: Date | null) =>
              setFormData({ ...formData, checkIn: date })
            }
            selectsStart
            startDate={formData.checkIn ?? undefined}
            endDate={formData.checkOut ?? undefined}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select check-in date"
            className="date-picker"
            required
          />
        </div>
        <div className="form-group">
          <label>Check-out Date:</label>
          <DatePicker
            selected={formData.checkOut}
            onChange={(date: Date | null) =>
              setFormData({ ...formData, checkOut: date })
            }
            selectsEnd
            startDate={formData.checkIn ?? undefined}
            endDate={formData.checkOut ?? undefined}
            minDate={formData.checkIn || new Date()}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select check-out date"
            className="date-picker"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Complete Reservation
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
