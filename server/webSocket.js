import { Server } from "socket.io";
import Drone from "./models/Drone.js";

export function setupWebSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // 드론 상태 업데이트 수신
    socket.on("droneStatus", async (data) => {
      await Drone.update(
        { lat: data.lat, lng: data.lng, battery: data.battery },
        { where: { id: data.id } }
      );
      io.emit("updateDroneStatus", data);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  return io;
}
