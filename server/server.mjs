import express from 'express';
import droneRoutes from './routes/droneRoutes';
import cors from 'cors';
import { http } from 'http';
import Server from 'socket.io'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/drone", droneRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));