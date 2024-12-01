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
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Önce odanın müsaitlik durumunu kontrol et
      const availableRooms = await roomService.getAvailableRooms({
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      });

      const isAvailable = availableRooms.data.some(
        (availableRoom) => availableRoom._id === room._id
      );

      if (!isAvailable) {
        setError("Room is not available for selected dates");
        return;
      }

      // Rezervasyon oluştur
      const totalPrice = calculateTotalPrice(
        room.price,
        formData.startDate,
        formData.endDate
      );

      await bookingService.createBooking({
        roomId: room._id.toString(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice,
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

  // Toplam fiyat hesaplama yardımcı fonksiyonu
  const calculateTotalPrice = (
    pricePerNight: number,
    startDate: Date,
    endDate: Date
  ): number => {
    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return pricePerNight * nights;
  };

  return (
    <div className="booking-form">
      <h3>Book This Room</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Check-in Date:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={(date) => setFormData({ ...formData, startDate: date })}
            minDate={new Date()}
            required
          />
        </div>
        <div className="form-group">
          <label>Check-out Date:</label>
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => setFormData({ ...formData, endDate: date })}
            minDate={formData.startDate || new Date()}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
