import { WebSocketServer } from "ws";
import { Message } from "./models/message.model.js";

let clients = [];

const socketServer = (server) => {
	try {
		// * - Sets up a WebSocket server using the provided HTTP server.
		const wss = new WebSocketServer({ server });

		// * - Handles new client connections, storing each client in a global `clients` array.
		wss.on("connection", (ws) => {
			console.log("New client connected");
			clients.push(ws);

			ws.on("message", async (data) => {
				const parseData = JSON.parse(data);

				// * - Listens for "init" messages to set the client's username and send the last 50 chat messages as history.
				if (parseData.type === "init") {
					ws.username = parseData.username;
					console.log(`User joined: ${ws.username}`);

					const messages = await Message.find()
						.sort({ createdAt: -1 })
						.limit(50)
						.exec();

					ws.send(
						JSON.stringify({
							type: "history",
							messages: messages.reverse(),
						})
					);
				} else if (parseData.type === "message") {
					//* - Listens for "message" messages to save new messages to the database and broadcast them to all connected clients.

					const newMessage = new Message({
						username: ws.username,
						message: parseData.message,
					});
					await newMessage.save();

				
					const messageData = {
						type: "new-message",
						message: {
							username: ws.username,
							message: parseData.message,
							timestamp: newMessage.timestamp,
						},
					};

					// console.log(messageData)
					clients.forEach((client) => {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify(messageData));
						}
					});
				}
			});

			//close event
			ws.on("close", () => {
				console.log("Client disconnected");
				clients = clients.filter((client) => client !== ws);
			});
		});
	} catch (error) {
		// * - Catches and logs any errors that occur during the WebSocket server setup.
		console.error("WebSocket server error:", error);
	}
};

export { socketServer };
