import express from "express";
import http from "http";
import cors from "cors";
import net from "net"; // 추가
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

const WEB_PORT = 8000;
const TCP_SOCKET_PORT = 9000;

const drones = {}; // 드론 데이터 저장 (droneId 기준)
let newDroneID = 1;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let tcpSocketClients = []; // TCP Socket 클라이언트를 저장할 배열
let webSocketClients = []; // Web Socket 클라이언트를 저장할 배열

// 📌 REST API (드론 등록)
app.post("/api/drone/register", (req, res) => {
  const { droneModel } = req.body;
  const droneId = `drone-${newDroneID++}`;

  drones[droneId] = {
    droneId,
    droneModel,
    mission: null,
    target: null,
    status: { battery: 100, speed: 0, location: null, connection: "waiting" },
  };

  console.log("[드론 등록됨]:", drones);
  res.json({ message: "드론 등록 성공!", droneId });
});

// 📌 REST API: 드론 목록 조회
app.get("/api/drone/list", (req, res) => {
  res.json(Object.values(drones));
});

// 📌 REST API: 드론에 미션 할당
app.post("/api/drone/assign-mission", (req, res) => {
  const { droneId, mission, target } = req.body;
  if (!drones[droneId]) {
    return res.status(400).json({ message: "존재하지 않는 드론 ID입니다." });
  }

  drones[droneId].mission = mission;
  drones[droneId].target = target;
  drones[droneId].status.connection = "active";

  console.log(`[미션 할당됨]: ${droneId} → ${mission}`);
  res.json({ message: "미션 할당 성공!" });
});

// 📌 TCP Socket 서버 설정
const tcpSocketServer = net.createServer((socket) => {
  console.log("[TCP 연결됨]");

  tcpSocketClients.push(socket);

  socket.on("data", (data) => {
    try {
      const droneData = JSON.parse(data.toString());
      const { droneId, battery, speed, location } = droneData;

      if (drones[droneId]) {
        drones[droneId].status = {
          battery,
          speed,
          location,
          connection: "active",
        };

        // 📌 WebSocket 클라이언트에게 데이터 전달
        webSocketClients.forEach((wsClient) => {
          wsClient.send(
            JSON.stringify({ type: "status-update", data: drones[droneId] })
          );
        });
      }
    } catch (error) {
      console.error("[TCP 데이터 오류]:", error);
    }
  });

  socket.on("end", () => {
    console.log("[TCP 연결 종료]");
    tcpSocketClients = tcpSocketClients.filter(
      (tcpSocketClient) => tcpSocketClient !== socket
    );
  });
});

// 📌 WebSocket 서버 설정
wss.on("connection", (ws) => {
  console.log("[WebSocket 연결됨]");
  webSocketClients.push(ws);

  ws.on("close", () => {
    console.log("[WebSocket 연결 종료]");
    webSocketClients = webSocketClients.filter((client) => client !== ws);
  });
});
// // 📌 WebSocket 서버 설정
// wss.on("connection", (ws) => {
//   console.log("[WebSocket 연결됨]");

//   webSocketClients.push(ws);

//   ws.on("message", (message) => {
//     try {
//       const { droenId, droneModel, battery, speed, location } =
//         JSON.parse(message);
//       if (drones[droneId]) {
//         drones[droneId].status = { droneModel, battery, speed, location };
//       }
//       ws.send(JSON.stringify(drones[droneId]?.status || {}));
//     } catch (error) {
//       console.error("[WebSocket 오류]:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("[WebSocket 연결 종료]");
//     webSocketClients = webSocketClients.filter(
//       (webSocketClient) => webSocketClient !== ws
//     );
//   });
// });

// 📌 TCP Socket 서버 시작
tcpSocketServer.listen(TCP_SOCKET_PORT, () => {
  console.log(`[TCP Socket 서버 실행] 포트: ${TCP_SOCKET_PORT}`);
});

// 📌 Web 서버 (REST + WebSocket) 실행
server.listen(WEB_PORT, () => {
  console.log(`[Web 서버 실행] 포트: ${WEB_PORT}`);
});
