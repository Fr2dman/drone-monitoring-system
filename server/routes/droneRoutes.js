import express from 'express';
const router = express.Router();

// 예제 드론 위치 데이터
let droneData = {
  lat: 37.5665,
  lng: 126.9780
};

// 드론 위치 반환 API
router.get("/location", (req, res) => {
  res.json(droneData);
});

// 드론 위치 변경 API (시뮬레이션용)
router.post("/update-location", (req, res) => {
  const { lat, lng } = req.body;
  droneData = { lat, lng };
  res.json({ message: "Drone location updated", droneData });
});

export default { router };