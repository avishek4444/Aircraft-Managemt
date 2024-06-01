import { useBooking } from "context/BookingContext";

const Checkout = () => {
  const { selectedSeat, bookSeat } = useBooking();

  console.log(selectedSeat);

  console.log(selectedSeat);
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-semibold">Checkout Your Booking!</h1>

      <div>
        <h2>Booking Details</h2>
        {selectedSeat.map((item , index) => {
          return (
            <div key={index}>
              <p>{item.seatName}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Checkout;
