import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import aircraftRoutes from "./routes/aircraftRoutes.js";



dotenv.config();

import userRoutes from "./routes/userRoutes.js";

const app = express();

// middle ware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: "*"
}));


app.use("/api/users", userRoutes);
app.use("/api/aircraft", aircraftRoutes);


// connect to database
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    app.listen(4000, () => {
      console.log("connected to MongoDB $ listening to port 4000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
