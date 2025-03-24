<script setup>
import { onMounted, ref, nextTick, defineEmits } from "vue";
import mapboxgl from "mapbox-gl";

// 환경 변수에서 API 토큰 가져오기
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const droneMarkers = ref({});
const targetPosition = ref(null); // 목표 위치 (마커 좌표)

// 부모 컴포넌트에 좌표 전달
const emit = defineEmits(["update-target-coordinates"]);

// WebSocket 설정
const ws = new WebSocket("ws://localhost:8000");

// function success(position) {
//   console.log(position.coords.latitude);
//   console.log(position.coords.longitude);
// }

// function error() {
//   console.error("위치 제공 불가");
// }

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(success, error);
//   } else {
//     console.error("이 브라우저에선 geolocation 객체를 사용할 수 없습니다");
//   }
// }

// getLocation();

// 드론 초기 좌표
const dronePosition = ref({
  lat: 35.20498929952396, // 서울 예제
  lng: 126.81016786999862,
});

ws.onmessage = (event) => {
  const { data } = JSON.parse(event.data);
  if (!data.location) return;

  if (!droneMarkers.value[data.droneId]) {
    const newMarker = new mapboxgl.Marker()
      .setLngLat([data.location.lng, data.location.lat])
      .addTo(map.value);
    droneMarkers.value[data.droneId] = newMarker;
  } else {
    droneMarkers.value[data.droneId].setLngLat([data.location.lng, data.location.lat]);
  }
};

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
// const fetchDroneData = async () => {
//   try {
//     //console.log(markers);
//     const response = await fetch("http://localhost:8000/api/drone/location");
//     const data = await response.json();
//     dronePosition.value = { lat: data.lat, lng: data.lng };

//     // 드론 위치 업데이트
//     if (droneMarkers.value) {
//       droneMarkers.value.setLngLat([dronePosition.value.lng, dronePosition.value.lat]);
//     }
//   } catch (error) {
//     console.error("드론 데이터를 불러오는데 실패했습니다:", error);
//   }
// };

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
      console.log("🌍 Map is fully loaded");
      window.dispatchEvent(new Event("resize"));
    });

    // 마커를 고정된 위치로 유지
    map.value.on("wheel", () => {
      console.log(marker.value);
    });

    map.value.on("contextmenu", (event) => {
      const { lng, lat } = event.lngLat;
      console.log("📍 선택된 좌표:", lat, lng);

      // 기존 마커 제거
      if (marker.value) {
        marker.value.remove();
      }

      // HTML 마커 생성
      const markerElement = document.createElement("div");
      markerElement.innerHTML = "🎯"; // 목표 지점 아이콘
      markerElement.style.fontSize = "24px";
      markerElement.style.textAlign = "center";
      markerElement.style.transform = "translate(-50%, -50%)";

      // 새로운 마커 추가
      marker.value = new mapboxgl.Marker({ element: markerElement, draggable: false })
        .setLngLat([lng, lat])
        .addTo(map.value);

      // 목표 위치 저장
      targetPosition.value = { lat, lng };
      console.log("targetPosition : ", targetPosition.value);

      // 주기적으로 드론 위치 업데이트
      //setInterval(fetchDroneData, 1000);
      
      // 부모(DashBoard.vue)로 좌표 전달
      emit("update-target-coordinates", { lat, lng });
    });

    // 창 크기 변경 이벤트 추가
    window.addEventListener("resize", handleResize);
  });
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
  position: relative;
  overflow: hidden; /* 맵이 넘치지 않도록 설정 */
}

/* 맵 스타일 */
.mapbox {
  height: 100%;
  border-radius: 10px;
}
</style>
