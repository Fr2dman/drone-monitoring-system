<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import mapboxgl from "mapbox-gl";

// 환경 변수에서 API 토큰 가져오기
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapContainer = ref(null); // 맵 컨테이너 참조
const map = ref(null);
const droneMarkers = ref({}); // 드론별 마커 저장

// WebSocket 설정
const ws = ref(null);

// 드론 초기 좌표
const dronePosition = ref({
  lat: 37.5665, // 서울 예제
  lng: 126.978,
});

// 창 크기 변경 시 맵 리사이징
const handleResize = () => {
  if (map.value) {
    setTimeout(() => {
      nextTick(() => {
        map.value.resize();
      });
    }, 300); // 딜레이를 줘서 브라우저 크기 변경 후 리사이징 적용
  }
};

// 드론 위치 가져오는 API 호출 함수
const fetchDroneData = async () => {
  try {
    console.log(markers);
    const response = await fetch("http://localhost:3000/api/drone/location");
    const data = await response.json();
    dronePosition.value = { lat: data.lat, lng: data.lng };

    // 드론 위치 업데이트
    if (droneMarker.value) {
      droneMarker.value.setLngLat([dronePosition.value.lng, dronePosition.value.lat]);
    }
  } catch (error) {
    console.error("드론 데이터를 불러오는데 실패했습니다:", error);
  }
};

// 맵 초기화
onMounted(() => {
  nextTick(() => {
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/dragonbong/cm8ifixrp017v01ssdiaz1k10",
      center: [dronePosition.value.lng, dronePosition.value.lat],
      zoom: 13,
    });

    map.value.on("load", () => {
      window.dispatchEvent(new Event("resize")); // 올바른 resize 이벤트 트리거
    });

    // 주기적으로 드론 위치 업데이트
    setInterval(fetchDroneData, 1000);
  });

  // 창 크기 변경 이벤트 추가
  window.addEventListener("resize", handleResize);
});
</script>

<template>
  <div class="map-container">
    <div ref="mapContainer" class="mapbox"></div>
  </div>
</template>

<style scoped>
/* 맵을 담을 부모 컨테이너 */
.map-wrapper {
  width: 100%;
  height: 100vh; /* 전체 화면 높이를 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

/* 맵 영역 */
.map-container {
  width: 100%;
  height: 700px; /* 고정 높이 설정 */
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow: hidden; /* 맵이 넘치지 않도록 설정 */
}

/* 맵 스타일 */
.mapbox {
  height: 100%;
  border-radius: 10px;
}
</style>
