import { Text } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import AircraftDesign from "./AircraftDesign";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "context/BookingContext";

const Aircraft = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nameOfClass = searchParams.get("class");
  const navigate = useNavigate();
  const { isAuthenticated, setNameOfClass } = useBooking();

  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/aircraft/" + id
      );
      return data;
    },
   
    queryKey: ["aircraft", id],
  });

  const proceedToBooking = () => {
    if (isAuthenticated) {
      setNameOfClass(nameOfClass);
      return navigate("/checkout/" + id);
    } else {
      navigate("/login?navigate=true");
      notifications.show({
        color: "red.3",
        title: "Cannot Proceed to Booking",
        message: "Please login to book seats.",
        icon: <IconX />,
      });
    }
  };

  const classData = [
    {
      color: "red",
      classDetail: data?.seatClass?.firstClass,
    },
    {
      classDetail: data?.seatClass?.businessClass,
      color: "blue",
    },
    {
      classDetail: data?.seatClass?.economyClass,
      color: "green",
    },
  ];

  return (
    <div className=" border-l-2 border-indigo-500 h-full w-full flex flex-col items-center pt-4">
      <h1 className="text-3xl font-bold underline">{data?.name}</h1>

      {/* <ClassDefination /> */}

      <div className="flex mt-10 gap-10 overflow-hidden">
        <div>
          {classData.map((item, index) => {
            return (
              <div key={index} className="mb-5">
                <div className="flex items-center gap-2 ">
                  <div
                    style={{
                      backgroundColor: item.color,
                    }}
                    className={`w-2 h-2 rounded-full`}
                  ></div>
                  <Text className="text-sm">{item?.classDetail?.name}</Text>
                </div>
                <div className="flex overflow-y-auto">
                  <div className=" mt-1">
                    <Text c="dimmed" size="sm">
                      • Total Seats: {item.classDetail?.numOfSeats}
                    </Text>
                    <Text c="dimmed" size="sm">
                      • Available Seats: {item.classDetail?.availableSeats}
                    </Text>
                    {/* <Text c="dimmed" size="sm">• Cost of Each Seat: ${seatClassData.seats?.seatPrice}</Text> */}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-center">
            <button
              onClick={proceedToBooking}
              className="bg-[#4287f5] hover:bg-orange-700 text-white px-10 py-2 rounded-md"
            >
              Proceed to booking
            </button>
          </div>
        </div>

        <div className="flex flex-col overflow-y-scroll">
          {classData.map((item, index) => {
            return (
              <AircraftDesign key={index} seatClassData={item.classDetail} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// const ClassDefination = () => {
//   return (
//     <div className="flex gap-3 my-5">
//       {classColorData.map((item, i) => {
//         return (
//           <div key={i} className="flex items-center gap-2 ">
//             <div
//               style={{
//                 backgroundColor: item.color,
//               }}
//               className={`w-2 h-2 rounded-full`}
//             ></div>
//             <Text className="text-sm">{item.name}</Text>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

export default Aircraft;
