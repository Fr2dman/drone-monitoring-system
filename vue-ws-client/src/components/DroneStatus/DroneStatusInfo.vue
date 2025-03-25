<script setup>
import { defineProps, ref, watchEffect, onMounted } from "vue";

const props = defineProps({
  selectedDroneId: String, // 부모 컴포넌트에서 선택된 드론 ID를 전달받음
});

const droneStatus = ref({}); // 여러 드론의 상태 저장
const isConnected = ref(false); // WebSocket 연결 상태 확인
const selectedDroneStatus = ref(null); // 선택된 드론의 상태 저장 (null로 초기화)

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
        
        // 기존 객체를 유지하면서 새로운 드론 상태를 업데이트
        droneStatus.value = { ...droneStatus.value, [data.droneId]: data };

        // 선택된 드론 ID에 해당하는 상태가 갱신된 경우, 즉시 업데이트
        if (props.selectedDroneId === data.droneId) {
          console.log("갱신합니다");

          // 드론 상태를 selectedDroneStatus에 할당
          selectedDroneStatus.value = {
            battery: data.status.battery,
            speed: data.status.speed,
            connection: data.status.connection,
            mission: data.mission,
            target: data.target
          };
        }
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

// ✅ 선택된 드론의 상태를 자동 업데이트
watchEffect(() => {
  if (props.selectedDroneId && droneStatus.value[props.selectedDroneId]) {
    console.log("[📌 선택된 드론 ID]:", props.selectedDroneId);
    selectedDroneStatus.value = droneStatus.value[props.selectedDroneId] || null;
    console.log("[📌 선택된 드론 상태]:", selectedDroneStatus.value);
  } else {
    selectedDroneStatus.value = null;
  }
});
</script>

<template>
  <div>
    <h2>드론 상태</h2>
    <p v-if="!isConnected" style="color: red">🚨 WebSocket 연결이 끊어졌습니다.</p>

    <div v-if="selectedDroneStatus && selectedDroneStatus.status">
      <h3>드론 ID: {{ props.selectedDroneId }}</h3>
      <p>배터리: {{ selectedDroneStatus.status.battery }}%</p>
      <p>속도: {{ selectedDroneStatus.status.speed }} km/h</p>
      <p>연결 상태: {{ selectedDroneStatus.status.connection }}</p>
      <p>임무: {{ selectedDroneStatus.mission }}</p>
      <p>목표 위치: {{ selectedDroneStatus.target.lat }}, {{ selectedDroneStatus.target.lng }}</p>
    </div>
    <p v-else>선택된 드론의 정보가 없습니다.</p>
  </div>
</template>
<style scoped>
/* 전체 컨테이너 스타일 */
.drone-status-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 헤더 스타일 */
.header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* 연결 상태 메시지 스타일 */
.disconnected-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* 상태 카드 스타일 */
.status-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.drone-id {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #007BFF;
}

.status-item {
  font-size: 16px;
  margin: 8px 0;
}

.status-item strong {
  color: #333;
}

/* 정보 없음 메시지 스타일 */
.no-drone-info {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}
</style>