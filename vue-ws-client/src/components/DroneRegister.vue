<script setup>
import { ref, onMounted, nextTick } from "vue";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapContainer = ref(null);
const map = ref(null);
const droneId = ref("");
const targetLat = ref("");
const targetLng = ref("");
const mission = ref("");

const registerDrone = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/drone/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        droneId: droneId.value,
        target: { lat: parseFloat(targetLat.value), lng: parseFloat(targetLng.value) },
        mission: mission.value,
      }),
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error("드론 등록 실패:", error);
  }
};
</script>

<template>
  <div class="drone-register">
    <h3>드론 등록</h3>
    <form @submit.prevent="registerDrone">
      <label>드론 ID:</label>
      <input v-model="droneId" type="text" required />

      <label>목표 지점 (lat, lng):</label>
      <input v-model="targetLat" type="number" step="0.0001" required />
      <input v-model="targetLng" type="number" step="0.0001" required />

      <label>미션:</label>
      <input v-model="mission" type="text" required />

      <button type="submit">등록</button>
    </form>
  </div>

  <!-- <div ref="mapContainer" class="mapbox"></div> -->
</template>

<style scoped>
.drone-register {
  margin-bottom: 20px;
  padding: 15px;
  background: #1c293c;
  color: white;
  border-radius: 8px;
}

.drone-register input {
  display: block;
  margin: 5px 0;
  padding: 8px;
  width: 100%;
}

.drone-register button {
  margin-top: 10px;
  padding: 8px;
  width: 100%;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.mapbox {
  width: 100%;
  height: 500px;
  border-radius: 10px;
}
</style>
