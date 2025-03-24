<script setup>
import { ref } from "vue";

const drones = ref({});
const selectedDrone = ref(null);

// WebSocket 연결
const ws = new WebSocket("ws://localhost:8000");

ws.onopen = () => {
  console.log("WebSocket 연결 성공");
};

ws.onerror = (error) => {
  console.error("WebSocket 오류:", error);
};

// WebSocket 메시지 수신 처리
ws.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);

    if (message.type === "init") {
      // 서버에서 보낸 초기 드론 목록
      const droneList = {};
      message.data.forEach((drone) => {
        droneList[drone.droneId] = drone;
      });
      drones.value = droneList;
    } else if (message.type === "status-update") {
      // 특정 드론의 상태 업데이트
      const updatedDrone = message.data;
      if (updatedDrone.droneId) {
        drones.value[updatedDrone.droneId] = {
          ...drones.value[updatedDrone.droneId],
          ...updatedDrone,
        };
      }
    } else if (message.type === "new-drone") {
      // 새로 등록된 드론을 목록에 추가
      const newDrone = message.data;
      drones.value[newDrone.droneId] = newDrone;
    }
  } catch (error) {
    console.error("데이터 파싱 오류:", error);
  }
};

// 드론 선택 시 이벤트 발생
const selectDrone = (droneId) => {
  selectedDrone.value = droneId;
  window.dispatchEvent(
    new CustomEvent("drone-selected", { detail: drones.value[droneId] })
  );
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
      <img src="\src\assets\no-drone.svg" alt="No-Drone" class="no-drone-img">
      <p class="no-drone-msg">등록된 드론이 없습니다.</p>
      <RouterLink to="/drone-status" class="drone-register-btn">드론 등록</RouterLink>
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
  font-size: 16px; /* Increased font size */
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
