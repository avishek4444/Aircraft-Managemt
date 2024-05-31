import express from "express"
import {bookSeat,getAllAircraft, createAircraft, searchAircraft, getOneAircraft} from "../controllers/aircraftController.js"

const router = express.Router()

router.get("/", getAllAircraft)

router.post("/createaircraft", createAircraft)

router.get("/:id", getOneAircraft)

router.post("/searchaircraft", searchAircraft)

router.post("/bookseat", bookSeat)

export default router
