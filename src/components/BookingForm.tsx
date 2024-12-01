import { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import { Room } from "../types/types";
import { bookingService, roomService } from "../services/api";

interface BookingFormProps {
  room: Room;
  onBookingComplete: () => void;
}

function BookingForm({ room, onBookingComplete }: BookingFormProps) {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    checkIn: null as Date | null,
    checkOut: null as Date | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isAvailable = await roomService.getRoomAvailability(
        room.id,
        formData.checkIn,
        formData.checkOut
      );

      if (!isAvailable) {
        setError("Room is not available for selected dates");
        return;
      }

      await bookingService.createBooking({
        roomId: room.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
      });

      onBookingComplete();
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // ... geri kalan kod aynı ...
}

export default BookingForm;
