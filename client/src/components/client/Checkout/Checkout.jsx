import { Button } from "@mantine/core";
import { useBooking } from "context/BookingContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSeat, bookSeat, setAircraftId } = useBooking();

  const checkout = () => {
    bookSeat();
    navigate(-1)
  }

  // Define a function to calculate the total price
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedSeat.forEach((item) => {
      // Assuming there is a price property in each selected seat item
      totalPrice += item.seatPrice;
    });
    return totalPrice;
  };

  useEffect(() => {
    if (id) {
      setAircraftId(id);
    }
  }, [setAircraftId, id]);

  return (
    <div className="text-center py-10 w-full mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">Checkout Your Booking!</h1>

      <div className="mt-10">
        <h2 className="mb-5 text-xl font-medium">Booking Details</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  Seat Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  Seat Class
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedSeat.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {item.seatName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {item.seatClass}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    ${item.seatPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display the total price */}
        <div className="mt-5 text-lg font-medium">
          <h2>Total Price: ${calculateTotalPrice().toFixed(2)}</h2>
        </div>

        <Button onClick={checkout} className="mt-5">
          Chekout
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
