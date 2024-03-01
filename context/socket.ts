import { io } from "socket.io-client";

const options = {
  transports: ["polling"],
  origin: "*",
};

const socket = io("https://backend-6q2l.onrender.com", options);

export default socket;
