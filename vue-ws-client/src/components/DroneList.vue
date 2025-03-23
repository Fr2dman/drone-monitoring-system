<script setup>
import { ref, onMounted } from "vue";

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

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    drones.value = data;
  } catch (error) {
    console.error("데이터 파싱 오류:", error);
  }
};

// 드론 선택 시 이벤트 발생
const selectDrone = (droneId) => {
  selectedDrone.value = droneId;
  window.dispatchEvent(new CustomEvent("drone-selected", { detail: drones.value[droneId] }));
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

    <p v-else class="no-drones">등록된 드론이 없습니다.</p>
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
