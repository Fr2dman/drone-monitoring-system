<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null); // 마커 저장 변수

onMounted(() => {
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [127.024612, 37.532600], // 초기 위치 (서울)
    zoom: 12,
  });

  // 우클릭 이벤트 리스너 추가
  map.value.on("contextmenu", (event) => {
    const { lng, lat } = event.lngLat;

    // 기존 마커 제거
    if (marker.value) {
      marker.value.remove();
    }

    // 새로운 마커 생성
    marker.value = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.value);
  });
});
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>