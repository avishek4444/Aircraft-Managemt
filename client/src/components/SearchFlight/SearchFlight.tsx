import React from "react";

import { Group, Title, Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconCheck, IconPlaneInflight } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import {useBooking} from "context/BookingContext";

import "@mantine/dates/styles.css";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const SearchFlight = ({ setFlightList }) => {
  const navigate = useNavigate();
  const {setSelectedSeat} = useBooking()

  const form = useForm({
    initialValues: {
      seatClass: "",
      noOfTraveller: "",
      from: "",
      to: "",
      departureData: "",
    },
  });

  const classNameModifier = () => {
    if (form.values.seatClass === "First Class") {
      return "firstClass";
    } else if (form.values.seatClass === "Business Class") {
      return "businessClass";
    } else if (form.values.seatClass === "Economy Class") {
      return "economyClass";
    } else {
      return "";
    }
  };

  const { mutate: searchFlight, isLoading } = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post(
        "http://localhost:4000/api/aircraft/searchaircraft",
        {
          seatClass:
            (form.values.seatClass === "First Class" && "firstClass") ||
            (form.values.seatClass === "Business Class" && "businessClass") ||
            (form.values.seatClass === "Economy Class" && "economyClass"),
          noOfTraveller: form.values.noOfTraveller,
          from: form.values.from,
          to: form.values.to,
          // departureData: form.values.departureData,
        }
      );
    },
    mutationKey: ["searchFlight"],
    onSuccess: (data) => {
      if (data) {
        setSelectedSeat([])
        setFlightList(data?.data);
      }
      navigate("/chooseflight?" + `class=${classNameModifier()}`);
    },
  });

  return (
    <form className="pt-20" onSubmit={form.onSubmit(() => searchFlight())}>
      <Title
        order={2}
        className="text-3xl"
        style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
        fw={900}
        ta="center"
        mb={40}
      >
        Search Flight
      </Title>

      <div className="flex flex-col items-center">
        <div className="flex gap-2">
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
        </div>

        <div className="flex items-center gap-2 my-5">
          <Select
            label="From"
            placeholder="Pick Location"
            data={["kathmandu", "mumbai", "pokhara", "uk", "usa"]}
            searchable
            clearable
            {...form.getInputProps("from")}
            required={true}
          />
          <IconPlaneInflight className="mt-5" />
          <Select
            label="To"
            placeholder="Pick Location"
            data={["canada", "heathrow"]}
            searchable
            clearable
            {...form.getInputProps("to")}
            required={true}
          />
        </div>

        <DateInput
          clearable
          defaultValue={new Date()}
          label="Departure Date"
          placeholder="Date input"
          className="w-full"
          {...form.getInputProps("departureData")}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Search
          </Button>
        </Group>
      </div>
    </form>
  );
};

export default SearchFlight;
