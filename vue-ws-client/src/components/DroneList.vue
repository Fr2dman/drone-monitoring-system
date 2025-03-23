<script setup>
import { ref, onMounted } from "vue";

const drones = ref({});
const selectedDrone = ref(null);

// WebSocket 연결
const ws = new WebSocket("ws://localhost:8000");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  drones.value = data;
};

// 드론 선택 시 이벤트 발생
const selectDrone = (droneId) => {
  selectedDrone.value = droneId;
  window.dispatchEvent(new CustomEvent("drone-selected", { detail: drones.value[droneId] }));
};
</script>

<template>
  <div class="drone-list">
    <h3>Drone List</h3>
    <ul>
      <li v-for="(drone, id) in drones" :key="id" @click="selectDrone(id)">
        <strong>{{ id }}</strong> - Battery: {{ drone.status?.battery }}% - Speed:
        {{ drone.status?.speed }} m/s
      </li>
    </ul>
  </div>
</template>

<style scoped>
.drone-list {
  border: 1px solid #ccc;
  background: #f9f9f9;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  cursor: pointer;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ddd;
  background: #fff;
}
li:hover {
  background: #e0e0e0;
}
</style>
