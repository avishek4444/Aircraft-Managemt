import mongoose from "mongoose";    
import {aircraftSchema} from "./schemas/aircraftSchema.js"

export default mongoose.model('aircraft', aircraftSchema);