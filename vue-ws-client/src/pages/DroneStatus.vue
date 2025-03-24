<script setup>
import DroneRegister from "@/components/DroneRegister.vue";
import DroneList from "@/components/DroneList.vue";
import DroneStatusInfo from "@/components/DroneStatus/DroneStatusInfo.vue";

const message = "This is Drone Status";
</script>

<template>
  <main>
    <h2>{{ message }}</h2>
    <div class="drone-status-container">
      <div class="dashboard-dronelist">
        <span>Drone List</span>
        <div class="drone-list-contents">
          <DroneRegister :initial-coordinates="selectedCoordinates" />
          <DroneList />
        </div>
      </div>

      <div class="dashboard-status">
        <span>Status</span>
        <DroneStatusInfo />
      </div>
    </div>
  </main>
</template>

<style scoped>
.drone-status-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}


/* Drone List 스타일 */
.dashboard-dronelist {
  flex: 1; /* 기본적으로 같은 비율 */
  min-width: 300px; /* 최소 너비 설정 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-dronelist .drone-list-contents {
  display: flex;
  gap: 10px;
}

/* Drone Status Panel 스타일 */
.dashboard-status {
  flex: 2; /* 차트 포함, 더 넓게 설정 */
  min-width: 400px; /* 최소 너비 설정 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 작은 화면에서도 같은 줄에 유지 */
@media (max-width: 1600px) {
  .drone-status-container {
    flex-wrap: wrap;
  }
  .dashboard-dronelist {
    flex: 1 1 100%; /* 화면이 좁아지면 한 줄 차지 */
  }

  .dashboard-status {
    flex: 1 1 100%; /* 화면이 좁아지면 아래로 */
  }
}

/* 제목 스타일 */
span {
  background-color: #1c293c;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
}
</style>
