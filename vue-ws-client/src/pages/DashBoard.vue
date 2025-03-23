<script setup>
import DashboardDroneMap from "@/components/Dashboard/DashboardDroneMap.vue";
import DroneList from "@/components/DroneList.vue";
import DroneRegister from "@/components/DroneRegister.vue";
import DroneStatusInfo from "@/components/DroneStatus/DroneStatusInfo.vue";
</script>

<template>
  <main class="dashboard-container">
    <!-- 맵을 상단 전체 너비로 배치 -->
    <div class="dashboard-map">
      <span>Drone Map</span>
      <DashboardDroneMap />
    </div>

    <!-- 하단 컨테이너: DroneList + Status 창 배치 -->
    <div class="dashboard-bottom">
      <div class="dashboard-dronelist">
        <span>Drone List</span>
        <div class="drone-list-contents">
          <DroneRegister />
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
/* 전체 컨테이너 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 맵이 상단 전체를 차지하도록 설정 */
.dashboard-map {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

/* 하단 컨테이너 (Drone List + Status) */
.dashboard-bottom {
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
  .dashboard-bottom {
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
