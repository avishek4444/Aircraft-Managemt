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
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export const BookingProvider = ({ children }) => {
  
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [nameOfClass, setNameOfClass] = useState("")
  const [aircraftId, setAircraftId] = useState("")

  const { mutate:bookSeat } = useMutation({
    mutationFn: async () => {
      const seatIds = selectedSeat?.map((seat) => seat._id);
      const seatName = selectedSeat?.map((seat) => seat.seatName)
      const seatClass = selectedSeat?.map((seat) => seat.seatClass)

      const userData = {
        name: auth.name,
        email: auth.email,
      };

      return await axios.post("http://localhost:4000/api/aircraft/bookseat", {
        id: aircraftId,
        seatIds: seatIds,
        seatClassName: nameOfClass,
        personData: userData,
        seatName,
        seatClass
      });
    },

    onSuccess: (data) => {
      setSelectedSeat([])
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
    mutationKey: "bla"
  });

  const {mutate:lockSeat, isLoading} = useMutation({
    mutationFn: async (id) => {
      const seatsIds = selectedSeat?.map((seat) => seat._id);
      return await axios.post("http://localhost:4000/api/aircraft/lockseat", {
        id: id,
        seatIds: seatsIds,
      })
    },
    onSuccess: (data) => {
     
      notifications.show({
        color: "green.3",
        title: "Success",
        message: "Seat Locked.",
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
    mutationKey: "bla"
  })

  return (
    <BookingContext.Provider
      value={{
        selectedSeat,
        setSelectedSeat,
        isAuthenticated,
        setNameOfClass,
        bookSeat,
        setAircraftId,
        lockSeat
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
