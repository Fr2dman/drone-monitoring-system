<script setup>
import { onMounted, ref } from "vue";

const droneStatus = ref({ battery: 0, speed: 0, location: { lat: 0, lng: 0 } });

onMounted(() => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.onmessage = (event) => {
    droneStatus.value = JSON.parse(event.data);
  };
});
</script>

<template>
  <div>
    <h2>드론 상태</h2>
    <p>배터리: {{ droneStatus.battery }}%</p>
    <p>속도: {{ droneStatus.speed }} km/h</p>
    <p>위치: {{ droneStatus.location.lat }}, {{ droneStatus.location.lng }}</p>
  </div>
</template>
