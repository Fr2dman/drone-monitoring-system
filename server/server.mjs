import express from "express";
import http from "http";
import cors from "cors";
import net from "net";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

const WEB_PORT = 8000;
const TCP_SOCKET_PORT = 9000;

const drones = {}; // 드론 데이터를 저장하는 객체
let newDroneID = 1;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let tcpSocketClients = []; // TCP 클라이언트 목록
let webSocketClients = []; // WebSocket 클라이언트 목록

// 📌 WebSocket으로 데이터 전송
const broadcastToWebSocketClients = (message) => {
  const jsonMessage = JSON.stringify(message);
  console.log("[📡 WebSocket 메시지 전송]:", jsonMessage);
  webSocketClients.forEach((wsClient) => {
    if (wsClient.readyState === wsClient.OPEN) {
      wsClient.send(jsonMessage);
    }
  });
};

// 📌 REST API: 드론 등록 (웹에서 수동 등록 가능)
app.post("/api/drone/register", (req, res) => {
  const { droneModel, mission, target } = req.body;
  const droneId = `drone-${newDroneID++}`;

  drones[droneId] = {
    droneId,
    droneModel,
    mission: mission || null,
    target: target || null,
    status: { battery: 100, speed: 0, location: null, connection: "waiting" },
  };

  console.log("[드론 등록됨]:", drones);

  // WebSocket을 통해 새로운 드론 정보 전송
  broadcastToWebSocketClients({ type: "new-drone", data: drones[droneId] });

  res.json({ message: "드론 등록 성공!", droneId });
});

// 📌 REST API: 드론 목록 조회
app.get("/api/drone/list", (req, res) => {
  res.json(Object.values(drones));
});

// 📌 REST API: 드론 모델 조회
app.get("/api/drone/info/:droneId", (req, res) => {
  const { droneId } = req.params;
  const drone = drones[droneId];

  if (!drone) {
    return res.status(404).json({ error: "드론을 찾을 수 없습니다." });
  }

  res.json({ id: drone.id, model: drone.model, status: drone.status });
});

// 📌 REST API: 드론에 미션 할당
app.post("/api/drone/assign-mission/:id", (req, res) => {
  const droneId = req.params.id; // URL에서 드론 ID 가져오기
  const { mission, target } = req.body;

  if (!drones[droneId]) {
    return res.status(400).json({ message: "존재하지 않는 드론 ID입니다." });
  }

  // 드론 정보 업데이트
  drones[droneId].mission = mission;
  drones[droneId].target = target;
  drones[droneId].status.connection = "active";

  console.log(`[미션 할당됨]: ${droneId} → ${mission}`);

  // WebSocket을 통해 업데이트된 드론 정보 전송
  const updateMessage = {
    type: "status-update",
    data: {
      droneId: droneId,
      mission: mission,
      target: target,
      status: drones[droneId].status
    },
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updateMessage));
    }
  });

  res.json({ message: "미션 할당 성공!" });
});

// 📌 TCP Socket 서버 설정 (자동 등록 포함)
const tcpSocketServer = net.createServer((socket) => {
  console.log("[TCP 연결됨]");

  tcpSocketClients.push(socket);

  socket.on("data", (data) => {
    try {
      const droneData = JSON.parse(data.toString().trim());
      const { droneId, droneModel, battery, speed, location } = droneData;
  
      console.log("[받은 데이터]:", droneData);
  
      // 📌 드론 ID를 socket에 저장
      socket.droneId = droneId;
  
      // 📌 드론이 등록되지 않은 경우 자동 등록
      if (!drones[droneId]) {
        drones[droneId] = {
          droneId,
          droneModel: droneModel || "Unknown Model",
          status: {
            battery: battery ?? "N/A",
            speed: speed ?? "N/A",
            location: location || { lat: 0, lng: 0 },
            connection: "active",
          },
        };
  
        console.log(`[새로운 드론 등록]: ${droneId}`);
  
        // WebSocket을 통해 프론트엔드에 새로운 드론 등록 알림
        broadcastToWebSocketClients({
          type: "new-drone",
          data: drones[droneId],
        });
      } else {
        // 📌 기존 드론 상태 업데이트
        drones[droneId].status = {
          battery,
          speed,
          location,
          connection: "active",
        };
  
        console.log(`[드론 데이터 갱신]: ${droneId}`, drones[droneId]);
  
        // 📌 WebSocket을 통해 프론트엔드에 상태 업데이트 전송
        broadcastToWebSocketClients({
          type: "status-update",
          data: drones[droneId],
        });
      }
    } catch (error) {
      console.error("[TCP 데이터 오류]:", error);
    }
  });
  
  // 📌 TCP 연결 종료 시 드론 삭제
  socket.on("end", () => {
    console.log("[TCP 연결 종료]");
  
    if (socket.droneId && drones[socket.droneId]) {
      delete drones[socket.droneId];
      console.log(`[드론 삭제됨]: ${socket.droneId}`);
  
      // WebSocket을 통해 삭제된 드론 정보 전송
      broadcastToWebSocketClients({
        type: "drone-deleted",
        data: socket.droneId,
      });
    }
  
    tcpSocketClients = tcpSocketClients.filter(
      (tcpSocketClient) => tcpSocketClient !== socket
    );
  });
  socket.on("error", (err) => {
    console.error("[TCP 소켓 오류]:", err);
  });
});

// 📌 WebSocket 서버 설정
wss.on("connection", (ws) => {
  console.log("[WebSocket 연결됨]");
  webSocketClients.push(ws);

  // 새로운 클라이언트에 초기 데이터 전송
  ws.send(JSON.stringify({ type: "init", data: Object.values(drones) }));

  ws.on("close", () => {
    console.log("[WebSocket 연결 종료]");
    webSocketClients = webSocketClients.filter((client) => client !== ws);
  });
});

// 📌 TCP Socket 서버 시작
tcpSocketServer.listen(TCP_SOCKET_PORT, () => {
  console.log(`[🚀 TCP Socket 서버 실행] 포트: ${TCP_SOCKET_PORT}`);
});

// 📌 Web 서버 (REST + WebSocket) 실행
server.listen(WEB_PORT, () => {
  console.log(`[🚀 Web 서버 실행] 포트: ${WEB_PORT}`);
});
