<script setup>
import { ref, defineEmits } from "vue";

// 드론 목록과 선택된 드론 정보 저장
const drones = ref({});
const selectedDrone = ref(null);
const emit = defineEmits(["update-selected-coordinates", "selectDrone"]);

// WebSocket 연결
const ws = new WebSocket("ws://localhost:8000");

ws.onopen = () => {
  console.log("✅ WebSocket 연결 성공");
};

ws.onerror = (error) => {
  console.error("❌ WebSocket 오류:", error);
};

// WebSocket 메시지 수신 처리
ws.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);

    if (message.type === "init") {
      const droneList = {};
      message.data.forEach((drone) => {
        droneList[drone.droneId] = drone;
      });
      drones.value = droneList;
    } else if (message.type === "status-update") {
      const updatedDrone = message.data;
      if (updatedDrone.droneId) {
        drones.value[updatedDrone.droneId] = {
          ...drones.value[updatedDrone.droneId],
          ...updatedDrone,
        };
      }
    } else if (message.type === "new-drone") {
      const newDrone = message.data;
      drones.value[newDrone.droneId] = newDrone;
    }
  } catch (error) {
    console.error("❌ 데이터 파싱 오류:", error);
  }
};

// 드론 선택 시 선택된 드론 정보와 좌표를 상위 컴포넌트로 전달
const selectDrone = (droneId) => {
  selectedDrone.value = droneId;
  // 부모 컴포넌트에 선택된 드론 ID 및 좌표 전달
  emit("handleDroneSelect", droneId);
  emit("update-selected-coordinates", {
    lat: drones.value[droneId]?.location?.lat,
    lng: drones.value[droneId]?.location?.lng,
  });
};
</script>

<template>
  <div class="drone-list">
    <h3>드론 목록</h3>

    <div v-if="Object.keys(drones).length > 0">
      <ul>
        <li
          v-for="(drone, id) in drones"
          :key="id"
          @click="selectDrone(id)"
          :class="{ selected: selectedDrone === id }"
        >
          <strong>{{ id }}</strong>
          <span class="status">
            배터리: {{ drone.status?.battery ?? "N/A" }}% | 속도:
            {{ drone.status?.speed ?? "N/A" }} m/s
          </span>
        </li>
      </ul>
    </div>

    <div v-else class="no-drones">
      <img src="\src\assets\no-drone.svg" alt="No-Drone" class="no-drone-img" />
      <p class="no-drone-msg">등록된 드론이 없습니다.</p>
      <RouterLink to="/drone-status" class="drone-register-btn"> 드론 등록 </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.drone-list {
  width: 100%;
  background: #1c293c;
  color: white;
  border-radius: 10px;
  padding: 10px;
  min-height: 200px; /* 드론 리스트가 없는 경우 대비 */
}

.drone-list h3 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

li.selected {
  background: rgba(76, 175, 80, 0.6); /* 선택한 드론 강조 */
}

li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.no-drones {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;
}
.no-drone-img {
  width: 150px;
  height: 150px;
  filter: invert(100%);
  opacity: 0.3;
}
.no-drone-msg {
  color: rgba(255, 255, 255, 0.3);
  margin: 0px;
  margin-bottom: 10px;
}

.drone-register-btn {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
  font-size: 16px;
}

.drone-register-btn:hover {
  background-color: #43a047;
}

@media (max-width: 768px) {
  .drone-list {
    min-width: 200px;
    max-width: 100%;
    padding: 8px;
  }

  li {
    font-size: 12px;
    padding: 8px;
  }
}
</style>
