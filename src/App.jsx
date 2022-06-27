import "./App.css";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

const socket = io("http://localhost:4001/");

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState("");
	// const [username, setUsername] = useState("");
	const [rooms, setRooms] = useState([]);
	const [room, setRoom] = useState("");
	const [showChat, setShowChat] = useState(false);
	// && room !== ""
	console.log(user);
	console.log(room, "detta är ett rum");
	const chooseUsername = () => {
		if (user !== "") {
			socket.emit("choose_username", user);
			// socket.emit("join_room", room);
			setShowChat(true);
		}
	};

	const chooseRoomname = () => {
		if (room !== "") {
			socket.emit("join_room", room);
		}
	};

	useEffect(() => {
		socket.on("connection", () => {
			// console.log("works?!!=!");
		});

		socket.on("befintligamedelanden", (data) => {
			setMessages(data);
		});
		socket.on("messages", ({ message, user, id }) => {
			console.log(message);
			console.log(id);
			setMessages((prevMessage) => {
				return [...prevMessage, { message, user, id }];
			});
		});
		// socket.on("user", (data) => {
		// 	setUser(data);
		// });
		return () => socket.off();
	}, []);

	function handleMessage(message) {
		socket.emit("messages", message);
	}

	function handleUser(event) {
		const userName = event.target.value;
		socket.emit("user", () => {
			setUser(userName);
		});
	}

	function getRooms() {
		socket.emit("existingRoom", () => {
			setRooms();
		});
	}

	return (
		<div className="App">
			{!showChat ? (
				<div className="joinChatContainer">
					<h3>Choose a username</h3>
					<input
						type="text"
						placeholder="John..."
						onChange={(event) => {
							setUser(event.target.value);
						}}
					/>
					<button onClick={chooseUsername}>Accept</button>
				</div>
			) : (
				<header className="App-header">
					<div className="application">
						<div className="appLayout">
							<div className="sideBar">
								<p>ROOMS:</p>
								<input
									type="text"
									placeholder="Room ID..."
									onChange={(event) => {
										setRoom(event.target.value);
									}}
								/>
								<button onClick={chooseRoomname}>Create</button>

								<div>
									<p className="userId">{room}:</p>
								</div>
							</div>
							<div className="chatLayout">
								<div className="chat">
									{messages.map((message) => (
										<div key={message.id}>
											{/* {message.user}: */}
											<p className="userId">
												{message.user.name}:
											</p>
											<p className="message">
												{message.message}
											</p>
										</div>
									))}
								</div>
								<div className="inputLayout">
									<input
										onChange={(e) =>
											setMessage(e.target.value)
										}
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
			)}
		</div>
	);
}

export default App;
