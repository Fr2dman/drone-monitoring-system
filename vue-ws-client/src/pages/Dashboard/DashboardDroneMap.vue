<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import mapboxgl from "mapbox-gl";

// 환경 변수에서 API 토큰 가져오기
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapContainer = ref(null); // 맵 컨테이너 참조
const map = ref(null);
const droneMarker = ref(null);
const markers = ref([]); // 사용자가 추가한 마커들

// 드론 초기 좌표
const dronePosition = ref({
  lat: 37.5665, // 서울 예제
  lng: 126.9780,
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
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/dragonbong/cm8ifixrp017v01ssdiaz1k10",
    center: [dronePosition.value.lng, dronePosition.value.lat],
    zoom: 13,
  });

  // 드론 마커 추가
  droneMarker.value = new mapboxgl.Marker({ color: "red" })
    .setLngLat([dronePosition.value.lng, dronePosition.value.lat])
    .addTo(map.value)
    .setPopup(new mapboxgl.Popup().setText("Drone Location"));

  // 주기적으로 드론 위치 업데이트
  setInterval(fetchDroneData, 5000);

  // 맵 클릭 시 마커 추가 기능
  map.value.on("dbclick", (e) => {
    const { lng, lat } = e.lngLat;

    // 새 마커 생성
    const newMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .addTo(map.value)
      .setPopup(new mapboxgl.Popup().setText(`위치: ${lat.toFixed(5)}, ${lng.toFixed(5)}`));

    markers.value.push(newMarker); // 마커 배열에 추가
  });
  // 창 크기 변경 이벤트 추가
  window.addEventListener("resize", handleResize);
});

// 컴포넌트 해제 시 이벤트 제거
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
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