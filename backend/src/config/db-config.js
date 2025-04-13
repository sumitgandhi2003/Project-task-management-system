import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const connectDB = async (count = 0) => {
  try {
    const isConnected = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
    if (isConnected) {
      console.log("Database connected...");
    } else {
      console.log("Database connection failed...");
    }
  } catch (error) {
    console.log(error.message);
    // if (count < 10) {
    //     setTimeout(() => connectDB(count + 1), 5000); // Retry after 5 seconds
    // } else {
    //     console.error("Max retries reached. Could not connect to the database.");
    // }
  }
  //   mongoose
  //     .connect(`${DB_URL}/${DB_NAME}`)
  //     .then(() => console.log("Database connected..."))
  //     .catch((error) => {
  //       console.log(error.message);
  //       // connectDB(count + 1);
  //     });
};

export default connectDB;
