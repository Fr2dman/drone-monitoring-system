import express from "express";
import Drone from "../models/Drone.js";
import MissionRecord from "../models/MissionRecord.js";

const router = express.Router();

// 드론 목록 가져오기
router.get("/drones", async (req, res) => {
  const drones = await Drone.findAll();
  res.json(drones);
});

// 특정 드론 정보 가져오기
router.get("/drones/:id", async (req, res) => {
  const drone = await Drone.findByPk(req.params.id);
  res.json(drone);
});

// 드론 미션 설정
router.post("/drones/:id/mission", async (req, res) => {
  const { targetLat, targetLng, missionType } = req.body;
  await MissionRecord.create({
    droneId: req.params.id,
    missionType,
    targetLat,
    targetLng,
  });
  res.json({ message: "Mission assigned!" });
});

export default router;
