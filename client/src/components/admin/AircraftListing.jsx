import React from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { Table, Group, ActionIcon, Button } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";

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

  console.log(aircraftList);

  const rows = aircraftList?.map((element, i) => (
    <Table.Tr key={element.name + i} className="text-white align-top">
      <Table.Td className="">{i + 1}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>
        {element.departureDates.map((date, i) => {
          return <div key={i}>{date}</div>;
        })}
      </Table.Td>

      <Table.Td>
        {element.destination.from.map((from, i) => {
          return <div key={i}>{from}</div>;
        })}
      </Table.Td>
      <Table.Td>
        {element.destination.to.map((to, i) => {
          return <div key={i}>{to}</div>;
        })}
      </Table.Td>

      <Table.Td>
        <Group>
          <Link
            to={`/dashboard/admin/clients/edit/${element._id}`}
            className="cursor-pointer text-white hover:text-green-400"
          >
            <ActionIcon color="green">
              <IconEdit size={16} />
            </ActionIcon>
          </Link>

          {/* <ActionIcon color="red" loading={isClientDeleted}>
            <IconTrash size={16} onClick={() => deleteClient(element?._id)} />
          </ActionIcon> */}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <div className="flex justify-between items-center py-5">
        <h3>Aircraft Lists:</h3>
        <Link to="addaircraft">
          <Button>Add Aircraft</Button>
        </Link>
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr className="text-white">
            <Table.Th>S.N</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Departure Dates</Table.Th>
            <Table.Th>From</Table.Th>
            <Table.Th>To</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {aircraftList?.length !== 0 ? (
          <Table.Tbody>{rows}</Table.Tbody>
        ) : (
          <h2 className="text-center block">No Item found!</h2>
        )}
      </Table>
    </div>
  );
};

export default AircraftListing;
