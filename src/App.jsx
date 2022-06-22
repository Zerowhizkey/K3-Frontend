import "./App.css";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

const socket = io("http://localhost:4001/");

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState("");

	useEffect(() => {
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
				<div className="application">
					<div className="appLayout">
						<div className="sideBar">
							<p>ROOMS:</p>
						</div>
						<div className="chatLayout">
							<div className="chat">
								{messages.map((message) => (
									<div>
										<p className="userId">
											{message.user}:
										</p>
										<p className="message">
											{message.message}
										</p>
									</div>
								))}
							</div>
							<div className="inputLayout">
								<input
									onChange={(e) => setMessage(e.target.value)}
									className="chatInput"
									type="text"
									placeholder="Message"
								></input>
								<button
									onClick={() => handleMessage(message)}
									className="inputButton"
								>
									Send
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
