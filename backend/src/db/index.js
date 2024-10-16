import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance);
    } catch (error) {
        console.log("MONGODB connection failed", error);
        process.exit(1)
    }
}

export default connectDB;