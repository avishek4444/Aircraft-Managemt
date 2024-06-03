import { Text } from "@mantine/core";
import React from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import {
  IconArrowNarrowRight,
  IconPlaneOff,
  IconPlaneTilt,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const ChooseFlight = () => {
  // const flightData = [1, 2]
  const [flightList] = useOutletContext();

  const [searchParams] = useSearchParams();
  const seatClassName = searchParams.get("class");

  if (flightList.length == 0) {
    return (
      <div className="border-l-2 border-indigo-500 h-full w-full text-center flex flex-col justify-center items-center">
        <IconPlaneOff size={"10em"} stroke={1.5} />
        <div className="text-center">
          <h1 className="text-3xl font-bold">No Flights Available!</h1>
          <h2 className=" ">Try searching with different inputs</h2>
        </div>
      </div>
    );
  }

  const seatClassNames =
    (seatClassName === "firstClass" && "First Class") ||
    (seatClassName === "businessClass" && "Business Class") ||
    (seatClassName === "economyClass" && "Economy Class");

  return (
    <div className="border-l-2 border-indigo-500 h-full w-full text-center">
      <div className="text-center pt-20">
        <h1 className="text-3xl font-bold">
          Available Fights for Your Destination!
        </h1>
        <h2 className="text-xl ">Choose Your Flight</h2>
      </div>

      <div className="inline-flex flex-col gap-4 mt-10">
        {flightList?.map((item, index) => {
          const numOfSeats =
            item?.seatClass?.[seatClassName]?.numOfSeats || "N/A";
          const availableSeats =
            item?.seatClass?.[seatClassName]?.availableSeats || "N/A";

          return (
            <Link
              to={item?._id + `?class=${seatClassName}`}
              key={index}
              className=" items-center gap-4 bg-[#3B3B3B] text-white inline-flex px-4 py-4 rounded-lg hover:scale-105 transition-all ease-in-out duration-[0.3s] "
            >
              <div>
                <IconPlaneTilt size={"2.5em"} />
              </div>
              <div>
                <Text className="text-left flex items-center gap-3s">
                  {item?.name}
                  {/* <IconArrowNarrowRight /> */}
                  
                </Text>
                <Text c="dimmed" size="sm">
                  Number of Seats: {numOfSeats} • Available Seats:{" "}
                  {availableSeats}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseFlight;
