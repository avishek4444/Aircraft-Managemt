import mongoose from "mongoose";
import aircraftModel from "../models/aircraftModel.js";

// ... other imports and functions ...

const generateSeats = (numOfSeats, seatPrice, seatName, seatClass) => {
  const seats = [];
  for (let i = 1; i <= numOfSeats; i++) {
    seats.push({
      id: `${i}`,
      seatStatus: "available",
      seatPrice: seatPrice,
      seatName,
      seatClass,
      passengerDetails: null,
      locked: false,
      lockTimestamp: null,
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
        data.seatClass.firstClass.numOfSeats,
        data.seatClass.firstClass.price,

        data.seatClass.firstClass.seatName,
        data.seatClass.firstClass.seatClass
      );
      data.seatClass.firstClass.availableSeats =
        data.seatClass.firstClass.numOfSeats;
    }
    if (
      data.seatClass.businessClass &&
      data.seatClass.businessClass.numOfSeats
    ) {
      data.seatClass.businessClass.seats = generateSeats(
        data.seatClass.businessClass.numOfSeats,
        data.seatClass.businessClass.price,
        data.seatClass.businessClass.seatName,
        data.seatClass.businessClass.seatClass
      );
      data.seatClass.businessClass.availableSeats =
        data.seatClass.businessClass.numOfSeats;
    }
    if (data.seatClass.economyClass && data.seatClass.economyClass.numOfSeats) {
      data.seatClass.economyClass.seats = generateSeats(
        data.seatClass.economyClass.numOfSeats,
        data.seatClass.economyClass.price,
        data.seatClass.economyClass.seatName,
        data.seatClass.economyClass.seatClass
      );
      data.seatClass.economyClass.availableSeats =
        data.seatClass.economyClass.numOfSeats;
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

const lockSeat = async (req, res) => {
  const { id, seatIds } = req.body;

  try {
    const airCraft = await aircraftModel.findOne({ _id: id });
    if (!airCraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const seatClasses = ["firstClass", "businessClass", "economyClass"];
    let lockedSeats = [];

    for (let seatId of seatIds) {
      let seat = null;
      let seatClassName = null;

      for (const className of seatClasses) {
        const seats = airCraft.seatClass?.[className]?.seats || [];
        seat = seats.find((s) => s.id === seatId);
        if (seat) {
          seatClassName = className;
          break;
        }
      }

      if (!seat) {
        return res
          .status(404)
          .json({ error: `Seat with ID ${seatId} not found` });
      }

      if (seat.locked) {
        return res
          .status(400)
          .json({ error: `Seat with ID ${seatId} is already locked` });
      }

      seat.locked = true;
      seat.lockTimestamp = new Date();
      lockedSeats.push(seat);

      setTimeout(async () => {
        const airCraft = await aircraftModel.findOne({ _id: id });
        const seats = airCraft.seatClass?.[seatClassName]?.seats || [];
        const seat = seats.find((s) => s.id === seatId);

        if (
          seat &&
          seat.locked &&
          new Date() - new Date(seat.lockTimestamp) >= 10 * 60 * 1000
        ) {
          seat.locked = false;
          seat.lockTimestamp = null;
          await airCraft.save();
        }
      }, 10 * 60 * 1000); // 10 minutes in milliseconds
    }

    await airCraft.save();
    res.status(200).json({ message: "Seats locked successfully", lockedSeats });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const unlockSeat = async (req, res) => {
  const { id, seatIds } = req.body;

  try {
    const airCraft = await aircraftModel.findOne({ _id: id });
    if (!airCraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const seatClasses = ["firstClass", "businessClass", "economyClass"];
    let unlockedSeats = [];

    for (let seatId of seatIds) {
      let seat = null;
      let seatClassName = null;

      for (const className of seatClasses) {
        const seats = airCraft.seatClass?.[className]?.seats || [];
        seat = seats.find((s) => s.id === seatId);
        if (seat) {
          seatClassName = className;
          break;
        }
      }

      if (!seat) {
        return res
          .status(404)
          .json({ error: `Seat with ID ${seatId} not found` });
      }

      if (!seat.locked) {
        return res
          .status(400)
          .json({ error: `Seat with ID ${seatId} is not locked` });
      }

      seat.locked = false;
      seat.lockTimestamp = null;
      unlockedSeats.push(seat);
    }

    await airCraft.save();
    res
      .status(200)
      .json({ message: "Seats unlocked successfully", unlockedSeats });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bookSeat = async (req, res) => {
  const { id, seatIds, personData, seatName, seatClass } = req.body;
  console.log(id, seatIds, personData);

  try {
    const airCraft = await aircraftModel.findOne({ _id: id });
    if (!airCraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const seatClasses = ["firstClass", "businessClass", "economyClass"];
    let allSeatsAvailable = true;
    let bookedSeats = [];

    // Check and book seats
    for (let i = 0; i < seatIds.length; i++) {
      let seatId = seatIds[i];
      let seatClassValue = seatClass[i];
      let seatNameValue = seatName[i];
      let seatFound = false;

      for (let className of seatClasses) {
        const seats = airCraft.seatClass[className]?.seats || [];
        const seat = seats.find((seat) => seat.id === seatId);

        if (seat) {
          seatFound = true;
          if (seat.seatStatus !== "available") {
            allSeatsAvailable = false;
          } else {
            seat.locked = false;
            seat.lockTimestamp = null;
            seat.seatStatus = "booked";
            seat.passengerDetails = personData;
            seat.seatClass = seatClassValue; // Update seat class
            seat.seatName = seatNameValue;   // Update seat name
            airCraft.seatClass[className].availableSeats -= 1;
            bookedSeats.push(seat);
          }
          break;
        }
      }

      if (!seatFound) {
        allSeatsAvailable = false;
      }
    }

    if (!allSeatsAvailable) {
      return res
        .status(400)
        .json({ error: "One or more seats are not available or locked" });
    }

    await airCraft.save();
    res
      .status(200)
      .json({ message: "Seats booked successfully", seats: bookedSeats });
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

const getSeatsBookedByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const airCrafts = await aircraftModel.find({
      "seatClass.firstClass.seats.passengerDetails.userId": userId,
    }).lean(); // Optional: .lean() to return plain JavaScript objects instead of Mongoose documents

    let bookedSeats = [];

    airCrafts.forEach((airCraft) => {
      const seatClasses = ["firstClass", "businessClass", "economyClass"];
      seatClasses.forEach((className) => {
        const seats = airCraft.seatClass[className]?.seats || [];
        seats.forEach((seat) => {
          if (seat.passengerDetails && seat.passengerDetails.userId === userId) {
            bookedSeats.push({
              aircraftName: airCraft.name,
              
              seat,
            });
          }
        });
      });
    });

    res.status(200).json(bookedSeats);
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
  lockSeat,
  unlockSeat,
  getSeatsBookedByUser
};
