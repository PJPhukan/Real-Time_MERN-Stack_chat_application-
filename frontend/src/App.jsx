import { useEffect, useRef, useState } from "react";
import GetUsername from "../components/getUsername";
import "./App.css";
import Message from "../components/Message";
function App() {
	const [ws, setWs] = useState(null);
	const [username, setUsername] = useState("");
	const [inputUsername, setInputUsername] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const chatRef = useRef();

	useEffect(() => {
		if (username && !ws) {
			const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL.replace(/^http/, 'ws'));

			socket.onopen = () => {
				console.log("WebSocket connection established");
				socket.send(JSON.stringify({ type: "init", username }));
			};

			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type === "history") {
					setMessages(data.messages);
				} else if (data.type === "new-message") {
					setMessages((prevMessages) => [
						...prevMessages,
						data.message,
					]);
				}
			};

			socket.onclose = () => {
				console.log("WebSocket connection closed");
			};

			setWs(socket);
		}
	}, [username, ws]);

	useEffect(() => {
		chatRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages]);

	const handleSendMessage = () => {
		if (ws && message.trim()) {
			ws.send(JSON.stringify({ type: "message", message }));
			setMessage("");
		}
	};
	// console.log(ws)

	if (!username) {
		return (
			<GetUsername
				inputUsername={inputUsername}
				setInputUsername={setInputUsername}
				setUsername={setUsername}
			/>
		);
	}
	console.log(messages);
	return (
		<div className="chat-container">
			<div className="container">
				<div className="chat-container-header">
					<p className="heading">Chat Room</p>
					<p className="sub-heading">Chat with your friends</p>
				</div>
				<div className="messages">
					{messages.map((msg, idx) => (
						<Message
							key={idx}
							username={msg.username}
							text={msg.message}
							date={msg.timestamp}
							isUser={msg.username === username}
						/>
					))}
					<div ref={chatRef}></div>
				</div>
				<div className="message-input">
					<input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) =>
							e.key === "Enter" && handleSendMessage()
						}
						className="input-message"
						placeholder="Type your message here..."
					/>
					<button onClick={handleSendMessage}>Send</button>
				</div>
			</div>
		</div>
	);
}

export default App;
