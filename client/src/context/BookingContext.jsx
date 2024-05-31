import React, { useContext, useState } from "react";

const BookingContext = React.createContext();

export function useBooking() {
  return useContext(BookingContext);
}

import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useMutation } from "react-query";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useParams } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export const BookingProvider = ({ children }) => {
  const { id: aircraftId } = useParams();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [nameOfClass, setNameOfClass] = useState("")

  console.log(selectedSeat);

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const seatIds = selectedSeat?.map((seat) => seat._id);

      const userData = {
        name: auth.name,
        email: auth.email,
      };

      return await axios.post("http://localhost:4000/api/aircraft/bookseat", {
        id: aircraftId,
        seatIds: seatIds,
        seatClassName: nameOfClass,
        personData: userData,
      });
    },

    onSuccess: (data) => {
      notifications.show({
        color: "green.3",
        title: "Success",
        message: "Booking sucessfully.",
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red.3",
        title: "Error occured",
        message: error.response.data.error,
        icon: <IconX />,
      });
    },
    queryKey: ["aircraft", aircraftId],
  });

  return (
    <BookingContext.Provider
      value={{
        selectedSeat,
        setSelectedSeat,
        isAuthenticated,
        setNameOfClass
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
