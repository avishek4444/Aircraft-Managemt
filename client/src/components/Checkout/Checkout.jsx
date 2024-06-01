import { useBooking } from "context/BookingContext";

const Checkout = () => {
  const { selectedSeat, bookSeat } = useBooking();

  // Define a function to calculate the total price
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedSeat.forEach((item) => {
      // Assuming there is a price property in each selected seat item
      totalPrice += item.seatPrice;
    });
    return totalPrice;
  };

  return (
    <div className="text-center py-10 w-50 mx-auto">
      <h1 className="text-2xl font-semibold">Checkout Your Booking!</h1>

      <div className="mt-10">
        <h2 className="mb-5">Booking Details</h2>
        <h1>hell0 avishek</h1>

        <div>
          {selectedSeat.map((item, index) => {
            return (
              <div key={index} className="border border-black">
                <p>
                  {item.seatName} - {item.seatClass}
                </p>
                {/* Assuming there is a price property in each selected seat item */}
                <p>Price: ${item.seatPrice}</p>
              </div>
            );
          })}
        </div>
        {/* Display the total price */}
        <h2>Total Price: ${calculateTotalPrice()}</h2>
      </div>
    </div>
  );
};

export default Checkout;
