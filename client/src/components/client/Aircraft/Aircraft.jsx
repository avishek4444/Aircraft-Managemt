import { Select, Text } from "@mantine/core";
import axios from "axios";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import AircraftDesign from "./AircraftDesign";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "context/BookingContext";

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const Aircraft = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nameOfClass = searchParams.get("class");
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { setNameOfClass, selectedSeat, setAircraftId, lockSeat, form } =
    useBooking();
  
  // Create refs for the child components
  const aircraftDesignRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/aircraft/" + id
      );
      return data;
    },

    queryKey: ["aircraft", id, "bla"],
  });

  const proceedToBooking = () => {
    if (isAuthenticated) {
      setNameOfClass(nameOfClass);
      setAircraftId(id);
      lockSeat(id);
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

  if (isLoading) return <div>Loading...</div>;

  // console.log(selectedSeat);

  const applyFilter = () => {
    if (aircraftDesignRef.current) {
      aircraftDesignRef.current.autoSelectSeats();
    }
  };

  return (
    <div className=" border-l-2 border-indigo-500 h-full w-full flex flex-col items-center pt-4">
      <h1 className="text-3xl font-bold underline">{data?.name}</h1>

      <form className="pt-5" onSubmit={form.onSubmit(() => applyFilter())}>
        <div className="flex gap-10 items-center ">
          <Select
            required={true}
            label="Select Class"
            placeholder="Class"
            data={["First Class", "Business Class", "Economy Class"]}
            {...form.getInputProps("seatClass")}
            searchable
            
            className="cursor-pointer"
          />
          <Select
            label="No. Of Traveller"
            placeholder="Traveller"
            data={["1", "2", "3", "4", "5", "6"]}
            {...form.getInputProps("noOfTraveller")}
            required={true}
            searchable
          />

          <button
            type="submit"
            className="bg-[#4287f5] hover:bg-orange-700 text-white px-5 py-1 rounded-md mt-6"
          >
            Apply
          </button>
        </div>
      </form>

      <ColorDefination />

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

          {selectedSeat.length > 0 && (
            <button
              onClick={proceedToBooking}
              className="bg-[#4287f5] hover:bg-orange-700 text-white px-10 py-2 rounded-md"
            >
              Proceed to booking
            </button>
          )}
        </div>

        <div className="flex flex-col overflow-y-scroll">
          {classData.map((item, index) => {
            return (
              <AircraftDesign key={index} ref={aircraftDesignRef} seatClassData={item.classDetail} aircraftClassData={data} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const colorData = [
  {
    name: "Selected",
    color: "#8DB6F7",
  },
  {
    name: "Booked",
    color: "gray",
  },
  {
    name: "Locked",
    color: "pink",
  },
];

const ColorDefination = () => {
  return (
    <div className="flex gap-3 my-5">
      {colorData.map((item, i) => {
        return (
          <div key={i} className="flex items-center gap-2 ">
            <div
              style={{
                backgroundColor: item.color,
              }}
              className={`w-2 h-2 rounded-full`}
            ></div>
            <Text className="text-sm">{item.name}</Text>
          </div>
        );
      })}
    </div>
  );
};

export default Aircraft;
