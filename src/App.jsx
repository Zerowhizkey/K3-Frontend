import "./App.css";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

let socket;

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState("");

	useEffect(() => {
		socket = io("http://localhost:4001/");
		socket.on("connection", () => {
			// console.log("works?!!=!");
		});
		socket.on("messages", ({ message, user }) => {
			console.log(message);
			setMessages((prevMessage) => {
				return [...prevMessage, { message, user }];
			});
		});
		socket.on("user", (data) => {
			setUser(data);
		});
		return () => socket.off();
	}, []);

	function handleMessage(message) {
		socket.emit("messages", { message, user });
	}

	return (
		<div className="App">
			<header className="App-header">
				<div className="chatForm">
					<div className="chat">
						{messages.map((message) => (
							<div>
								<p className="userId">{message.user}:</p>
								<p className="message">{message.message}</p>
							</div>
						))}
					</div>
					<input
						onChange={(e) => setMessage(e.target.value)}
						className="chatInput"
						type="text"
						placeholder="Message"
					></input>
				</div>
				<button
					onClick={() => handleMessage(message)}
					className="inputButton"
				>
					Send
				</button>
			</header>
		</div>
	);
}

export default App;
