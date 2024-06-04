import { Button, Tooltip } from "@mantine/core";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useQuery } from "react-query";
const BookingHistory = () => {
  const auth = useAuthUser();
  const userId = auth.id;

  const { data, isLoading } = useQuery({
    queryKey: ["bookingHistory", userId],
    queryFn: async () => {
      const response = await axios(
        `http://localhost:4000/api/aircraft/getSeatsBookedByUser/${userId}`
      );

      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="py-10 w-full mx-auto max-w-3xl text-center">
      <h1 className="my-5 text-3xl font-semibold">Your Booking History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Aircraft Name
              </th>
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
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item?.aircraftName}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item?.seat?.seatName}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item?.seat?.seatClass}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ${item?.seat.seatPrice?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Tooltip label="Cannot Cancel Seat Before 72 Hours">
        <Button className="mt-10 bg-red-400 text-white cursor-not-allowed" disabled={true}>
          Cancel Your Seat!
        </Button>
      </Tooltip>
    </div>
  );
};

export default BookingHistory;
