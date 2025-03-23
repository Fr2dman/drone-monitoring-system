import WebSocket from "ws";
import net from "net";

const DRONE_ID = "drone-001"; // 드론 ID
const SERVER_URL = "ws://localhost:8000"; // WebSocket 서버 주소
const TCP_SERVER_PORT = 9000; // TCP 서버 포트

// 1️⃣ WebSocket 연결
const ws = new WebSocket(SERVER_URL);

ws.on("open", () => {
  console.log("[WebSocket] 서버와 연결됨!");

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
  }, 5000); // 5초마다 전송
});

ws.on("message", (data) => {
  console.log("[WebSocket] 서버 응답:", data.toString());
});

ws.on("error", (err) => console.error("[WebSocket] 오류 발생:", err));
ws.on("close", () => console.log("[WebSocket] 연결 종료"));

// 2️⃣ TCP 소켓 연결
const tcpClient = new net.Socket();
tcpClient.connect(TCP_SERVER_PORT, "localhost", () => {
  console.log("[TCP] 서버와 연결됨!");
});

tcpClient.on("data", (data) => {
  console.log("[TCP] 받은 데이터:", data.toString());
});

tcpClient.on("error", (err) => console.error("[TCP] 오류 발생:", err));
tcpClient.on("close", () => console.log("[TCP] 연결 종료"));
