import mongoose from "mongoose";

import aircraftModel from "../models/aircraftModel.js";

// const createAircraft = async (req, res) => {
//   const data = req.body;
//   try {
//     const airCraft = await aircraftModel.insertMany(data);
//     res.status(200).json(airCraft);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const generateSeats = (numOfSeats) => {
  const seats = [];
  for (let i = 1; i <= numOfSeats; i++) {
    seats.push({
      id: `${i}`,
      seatStatus: "available",
      seatPrice: 0,
      passengerDetails: null,
    });
  }
  return seats;
};

const createAircraft = async (req, res) => {
  const data = req.body;

  try {
    // Generate seats for each class
    if (data.seatClass.firstClass && data.seatClass.firstClass.numOfSeats) {
      data.seatClass.firstClass.seats = generateSeats(
        data.seatClass.firstClass.numOfSeats
      );
    }
    if (
      data.seatClass.businessClass &&
      data.seatClass.businessClass.numOfSeats
    ) {
      data.seatClass.businessClass.seats = generateSeats(
        data.seatClass.businessClass.numOfSeats
      );
    }
    if (data.seatClass.economyClass && data.seatClass.economyClass.numOfSeats) {
      data.seatClass.economyClass.seats = generateSeats(
        data.seatClass.economyClass.numOfSeats
      );
    }

    const airCraft = await aircraftModel.insertMany([data]); // Changed to an array for insertMany
    res.status(200).json(airCraft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAircraft = async (req, res) => {
  const airCraft = await aircraftModel.find({}).sort({ createdAt: -1 });
  res.status(200).json(airCraft);
};

const getOneAircraft = async (req, res) => {
  const { id } = req.params;
  const airCraft = await aircraftModel.findOne({ _id: id });
  res.status(200).json(airCraft);
};

const bookSeat = async (req, res) => {
  const { id, seatIds, seatClassName, personData } = req.body;
  console.log(id, seatIds, seatClassName, personData);
  try {
    const airCraft = await aircraftModel.findOne({ _id: id });
    if (!airCraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const seats = airCraft.seatClass?.[seatClassName]?.seats || [];
    let allSeatsAvailable = true;

    // Check if all requested seats are available
    seatIds.forEach((seatId) => {
      const seat = seats.find((seat) => seat.id === seatId);
      if (!seat || seat.seatStatus !== "available") {
        allSeatsAvailable = false;
      }
    });

    if (!allSeatsAvailable) {
      return res
        .status(400)
        .json({ error: "One or more seats are not available" });
    }

    // Book the seats and add passenger details
    seatIds.forEach((seatId) => {
      const seat = seats.find((seat) => seat.id === seatId);
      seat.seatStatus = "booked";
      seat.passengerDetails = personData;
    });

    airCraft.seatClass[seatClassName].availableSeats -= seatIds.length;
    await airCraft.save();

    res.status(200).json({ message: "Seats booked successfully", seats });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchAircraft = async (req, res) => {
  const {
    seatClass,
    noOfTraveller,
    from,
    to,
    // departureDate
  } = req.body;

  const query = {};

  if (seatClass) {
    query[`seatClass.${seatClass}.availableSeats`] = {
      $gte: parseInt(noOfTraveller),
    };
  }

  if (from) {
    query["destination.from"] = { $in: from.split(",") };
  }

  if (to) {
    query["destination.to"] = { $in: to.split(",") };
  }

  // if (departureDate) {
  //   query["departureDates"] = { $in: [new Date(departureDate)] };
  // }

  try {
    const airCraft = await aircraftModel.find(query);
    res.status(200).json(airCraft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getAllAircraft,
  createAircraft,
  searchAircraft,
  getOneAircraft,
  bookSeat,
};
