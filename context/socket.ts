import { io } from "socket.io-client";

const options = {
  transports: ["polling"],
  origin: "*",
};

const socket = io("http://192.168.0.110:5500", options);

export default socket;
