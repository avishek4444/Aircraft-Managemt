import mongoose from "mongoose";

const Schema = mongoose.Schema;

const passengerDetailsSchema = new Schema(
  {
    personId: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const seatSchema = new Schema(
  {
    seatStatus: {
      type: String,
      required: false,
    },
    seatPrice: {
      type: Number,
      required: false,
    },
    passengerDetails: {
      type: passengerDetailsSchema,
      required: false,
    },
  },
  { _id: true }
);

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    numOfSeats: {
      type: Number,
      required: false,
    },
    availableSeats: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    seats: [seatSchema],
  },
  { _id: true }
);

const aircraftSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "available",
    },
    departureDates: [String],
    destination: {
      from: [String],
      to: [String],
    },
    seatClass: {
      firstClass: classSchema,
      businessClass: classSchema,
      economyClass: classSchema,
    },
  },
  { timestamps: true }
);

export { aircraftSchema };
