import { io } from "socket.io-client";

//The code snippet above creates a real-time connection to the server hosted at that URL.
const socket = io.connect("http://localhost:4000");

export default socket;