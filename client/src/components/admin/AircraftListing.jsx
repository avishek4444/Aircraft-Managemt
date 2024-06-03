import React from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { Table, Group, ActionIcon, Button } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const AircraftListing = () => {
  const queryClient = useQueryClient();

  const { data: aircraftList, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axios.get("http://localhost:4000/api/aircraft");
      return response?.data;
    },
    queryKey: ["getAllAircrafts"],
    onSuccess: (response) => {
      console.log(response);
    },
    onError: () => {
      notifications.show({
        color: "red.3",
        title: "Error occurred",
        message: "Cannot get aircraft list.",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>Aircraft Lists:</h3>
        <Button>
            Add Aircraft
        </Button>
      </div>
      <Table highlightOnHover></Table>
    </div>
  );
};

export default AircraftListing;
