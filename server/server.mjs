import express from 'express';
import droneRoutes from './routes/droneRoutes';
import cors from 'cors';
import { http } from 'http';
import Server from 'socket.io'
``
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/drone', droneRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));