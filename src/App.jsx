import "./App.css";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
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
	// console.log(user);
	// console.log(room, "detta är ett rum");
	const chooseUsername = () => {
		if (user !== "") {
			socket.emit("choose_username", user);
			// socket.emit("join_room", room);
			setShowChat(true);
		}
	};

	const chooseRoomname = (room) => {
		if (room !== "") {
			socket.emit("join_room", room);
		}
	};

	useEffect(() => {
		socket.on("connection", (data) => {
			// console.log("works?!!=!");
			setRooms(data);
			// console.log(data);
		});
		socket.on("update_room", (data) => {
			setRooms(data);
		});
		socket.on("deleted_room", (data) => {
			setRooms(data);
			setMessages([]);
		});

		// socket.on("rooms", (data) => {});
		socket.on("sent_message", (data) => {
			setMessages(data);
		});
		socket.on("sent_message", (messages) => {
			console.log(messages);
			// console.log(id);
			setMessages((prevMessage) => {
				return [...prevMessage];
			});
			// console.log(data);
		});
		// socket.on("user", (data) => {
		// 	setUser(data);
		// });
		return () => socket.off();
	}, []);

	function handleMessage(msg) {
		socket.emit("message", {
			msg,
			roomName: room,
			username: user,
		});
	}

	function handleUser(event) {
		const userName = event.target.value;
		socket.emit("user", () => {
			setUser(userName);
		});
	}

	const handleDelete = (roomName) => {
		socket.emit("delete_room", roomName);
	};

	// function getAllRooms() {
	// 	socket.emit("existingsRoom", () => {
	// 		setRooms();
	// 	});
	// }

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
								<button onClick={() => chooseRoomname(room)}>
									Create
								</button>

								<div>
									{rooms.map((room) => (
										<div key={room.id}>
											<p
												className="userId"
												onClick={() => {
													setRoom(room.name);
													chooseRoomname(room.name);
												}}
											>
												{room.name}
											</p>
											<button
												onClick={() =>
													handleDelete(room.name)
												}
											>
												x
											</button>
										</div>
									))}
								</div>
							</div>
							<div className="chatLayout">
								<div className="chat">
									{messages.map((message) => (
										<div key={message.id}>
											<p className="userId">
												{message.user_name}:
											</p>
											<p className="message">
												{message.msg}
											</p>
											<p className="date">
												{dayjs(message.date).format(
													"YY-MM-DD HH:mm"
												)}
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
