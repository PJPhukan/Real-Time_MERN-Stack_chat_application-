import mongoose from "mongoose";

const connectDB = async () => {
	try {
		//connect with database
		await mongoose.connect(process.env.MONGO_URI || "");
		console.log("DB connected successfully");
	} catch (error) {
		console.error("DB connection failed", error.message);
		process.exit(1); // Exit the process if connection fails
	}
};

export { connectDB };
