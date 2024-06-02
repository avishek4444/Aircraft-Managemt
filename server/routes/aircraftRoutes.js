import express from "express"
import {bookSeat,getAllAircraft, createAircraft, searchAircraft, getOneAircraft,lockSeat,unlockSeat} from "../controllers/aircraftController.js"

const router = express.Router()

router.get("/", getAllAircraft)

router.post("/createaircraft", createAircraft)

router.get("/:id", getOneAircraft)

router.post("/searchaircraft", searchAircraft)

router.post("/bookseat", bookSeat)

router.post("/lockseat", lockSeat)

router.post("/unlockseat", unlockSeat)

export default router
