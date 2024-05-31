import mongoose from "mongoose";
import {userSchema} from "./schemas/userSchema.js";

export default mongoose.model('user', userSchema);

