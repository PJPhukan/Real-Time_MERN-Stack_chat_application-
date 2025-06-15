import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { socketServer } from "./wsServer.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: "https://684f16bfcbe011df5ce90caf--chat-application-pjphukan.netlify.app",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

//create server
const server = createServer(app);

//server listen
server.listen(process.env.PORT || 5080, () => {
	console.log(
		`Server is running on 🚀🚀 http://localhost:${process.env.PORT || 5080}`
	);
});

socketServer(server);
