<script setup>
import { onMounted, ref } from "vue";

const droneStatus = ref({}); // 여러 드론의 상태 저장
const isConnected = ref(false); // WebSocket 연결 상태 확인

onMounted(() => {
  const socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    console.log("✅ WebSocket 연결 성공");
    isConnected.value = true;
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("📩 [WebSocket 데이터 수신]:", message);

      if (message.type === "status-update") {
        const { data } = message;
        droneStatus.value[data.droneId] = data.status;
      }
    } catch (error) {
      console.error("❌ WebSocket 데이터 파싱 오류:", error);
    }
  };

  socket.onclose = () => {
    console.log("❌ WebSocket 연결 종료");
    isConnected.value = false;
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket 오류 발생:", error);
  };
});
</script>

<template>
  <div>
    <h2>드론 상태</h2>
    <p v-if="!isConnected" style="color: red">🚨 WebSocket 연결이 끊어졌습니다.</p>

    <div v-for="(status, droneId) in droneStatus" :key="droneId">
      <h3>{{ droneId }}</h3>
      <p>배터리: {{ status.battery }}%</p>
      <p>속도: {{ status.speed }} km/h</p>
      <p>위치: {{ status.location.lat }}, {{ status.location.lng }}</p>
      <hr />
    </div>
  </div>
</template>
