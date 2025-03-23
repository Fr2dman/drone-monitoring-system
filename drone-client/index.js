import WebSocket from "ws";
import net from "net";

const DRONE_ID = `drone-${Math.floor(Math.random() * 1000)}`;
const SERVER_URL = "ws://localhost:8000"; // WebSocket 서버 주소
const TCP_SERVER_PORT = 9000; // TCP 서버 포트

// 1️⃣ WebSocket 연결
const ws = new WebSocket(SERVER_URL);

let mission = null;
let target = null;
let location = { lat: 37.5665, lng: 126.978 };

ws.on("open", () => {
  console.log("[WebSocket] 서버와 연결됨!:", DRONE_ID);

  // 임의의 초기 데이터 전송
  setInterval(() => {
    const status = {
      droneId: DRONE_ID,
      battery: Math.floor(Math.random() * 100), // 랜덤 배터리 상태
      speed: Math.random() * 10, // 랜덤 속도
      location: { lat: 37.5665, lng: 126.978 }, // 서울 좌표 예제
    };

    ws.send(JSON.stringify(status));
    console.log("[WebSocket] 데이터 전송:", status);
  }, 1000); // 1초마다 전송
});

ws.on("message", (message) => {
  const data = JSON.parse(message.toString());

  if (data.type === "mission") {
    mission = data.mission;
    target = data.target;
    console.log(`[미션 수락]: ${mission} → ${JSON.stringify(target)}`);
  }
});

ws.on("error", (err) => console.error("[WebSocket] 오류 발생:", err));
ws.on("close", () => console.log("[WebSocket] 연결 종료"));

// 2️⃣ TCP 소켓 연결
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
      battery: Math.max(0, 100 - Math.random() * 10),
      speed: Math.random() * 10,
      location,
    };

    tcpClient.write(JSON.stringify(droneStatus));
  }, 1000);
});
