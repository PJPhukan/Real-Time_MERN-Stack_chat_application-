import React from "react";

const Message = ({ username, text, date, isUser }) => {
	//convert ISO date string to a more readable format
	const formatDate = (isoDateString) => {
		const date = new Date(isoDateString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			return "Invalid date";
		}

		const options = {
			month: "2-digit",
			day: "2-digit",
			year: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		};

		return date.toLocaleString("en-US", options);
	};

	return (
		<div className={`message-container ${isUser ? "user" : ""}`}>
			<div className="message-wrapper">
				<p className="message-header">
					<span className="username">
						{isUser ? "You" : username}
					</span>
					<span className="date">{formatDate(date)}</span>
				</p>
				<p className="text">{text}</p>
			</div>
		</div>
	);
};
export default Message;
