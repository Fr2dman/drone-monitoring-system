// import WebSocket from "ws";
import net from "net";

const DRONE_ID = `drone-${Math.floor(Math.random() * 1000)}`;
const DRONE_MODEL = "99AirJY730";
// const SERVER_URL = "ws://localhost:8000"; // WebSocket 서버 주소
const TCP_SERVER_PORT = 9000; // TCP 서버 포트

let mission = null;
let target = null;
let location = { lat: 37.5665, lng: 126.978 };
let status = null;

// 1️⃣ TCP 소켓 연결
const tcpClient = new net.Socket();
tcpClient.connect(TCP_SERVER_PORT, "localhost", () => {
  console.log("[TCP] 연결됨:", DRONE_ID);

  setInterval(() => {
    if (mission && target) {
      location.lat += (target.lat - location.lat) * 0.1;
      location.lng += (target.lng - location.lng) * 0.1;
    }

    const droneStatus = {
      droneId: DRONE_ID,
      droneModel: DRONE_MODEL,
      battery: Math.max(0, 100 - Math.random() * 10).toFixed(1), // 배터리 소수점 첫 번째 자리
      speed: (Math.random() * 10).toFixed(2), // 속도 소수점 두 번째 자리
      status: 
      location,
    };

    console.log(droneStatus);
    tcpClient.write(JSON.stringify(droneStatus));
  }, 1000);
});
