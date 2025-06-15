import React from "react";
import "../src/App.css";
const getUsername = ({ inputUsername, setInputUsername, setUsername }) => {
	return (
		<div className="home-container">
			<div className="home-background">
				<h3>Welcome to ChatRoom</h3>
				<p>Please enter your username to join the chat</p>
				<div className="inputGroup">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						value={inputUsername}
						onChange={(e) => setInputUsername(e.target.value)}
						required
						id="username"
						onKeyDown={(e) => e.key === "Enter" && setUsername(inputUsername)}
					/>
				</div>

				<button
					onClick={() => setUsername(inputUsername)}
					
					className="joinChatButton"
				>
					Join Chat
				</button>
			</div>
		</div>
	);
};

export default getUsername;
