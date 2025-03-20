import express from 'express';
import { getDroneStatus, setTargetPoint } from './controllers/droneController';

const router = express.Router();

router.get('/status', getDroneStatus);
router.post('/target', setTargetPoint);

export default { router };