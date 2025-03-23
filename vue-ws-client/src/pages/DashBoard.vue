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
  gap: 20px; /* 섹션 간격 */
  /* padding: 20px; */
}

/* 맵이 상단 전체를 차지하도록 설정 */
.dashboard-map {
  display: flex;
  flex-direction: column;
  gap: 10px; /* span과 맵 사이 간격 */
  width: 100%;
}

/* 하단 컨테이너 (Drone List + Status) */
.dashboard-bottom {
  display: flex;
  gap: 20px; /* 두 개의 요소 간격 */
}

/* Drone List 스타일 */
.dashboard-dronelist {
  flex: 1; /* 남은 공간을 균등하게 차지 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-dronelist .drone-list-contents {
  padding: 0px;
  display: flex;
}
/* Status Panel 스타일 */
.dashboard-status {
  flex: 1; /* Drone List와 동일한 크기 */
  display: flex;
  flex-direction: column;
  gap: 10px;
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
