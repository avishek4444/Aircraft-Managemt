import React from "react";
import {
  TextInput,
  Group,
  Button,
  Stack,
  Select,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const AddAircraft = () => {
  const form = useForm({
    initialValues: {
      name: "",
      departureDates: [],
      destination: {
        from: [],
        to: [],
      },
      seatClass: {
        firstClass: {
          name: "",
          numOfSeats: null,
          price: null,
        },
        businessClass: {
          name: "",
          numOfSeats: null,
          price: null,
        },
        economyClass: {
          name: "",
          numOfSeats: null,
          price: null,
        },
      },
    },

    // validate: {
    //   email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    //   password: (val) =>
    //     val.length <= 3
    //       ? "Password should include at least 6 characters"
    //       : null,
    // },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: any) => {
      // return await axios.post("http://localhost:4000/api/users/signup", {
      //   email: form.values.email,
      //   name: form.values.name,
      //   password: form.values.password,
      //   role: "client",
      // });
    },
    mutationKey: ["registerUser"],
    onSuccess: (data) => {
      notifications.show({
        color: "green.3",
        title: "Success",
        message: "client added successfully",
        // icon: <IconCheck />,
      });
      form.reset();
    },
    onError: (error: any) => {
      notifications.show({
        color: "red.3",
        title: "Error occured",
        message: error.message,
        // icon: <IconX />,
      });
    },
  });

  return (
    <>
      <h2 className="mb-4 text-white">Add Aircraft</h2>
      <form onSubmit={form.onSubmit(() => mutate())}>
        <Stack className="text-white">
          <TextInput
            required
            label="Name"
            placeholder="Boing 123"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl">
            Add Aircraft
          </Button>
        </Group>
      </form>
    </>
  );
};

export default AddAircraft;
