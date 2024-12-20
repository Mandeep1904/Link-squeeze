import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.log(`Couldn't connect to MongoDB : ${error}`);
    }
}

export default connectDB;