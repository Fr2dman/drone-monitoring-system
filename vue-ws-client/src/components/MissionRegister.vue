<script setup>
import { ref, watch, defineProps } from "vue";
// import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const props = defineProps({
  initialCoordinates: Object, // DashBoard.vue에서 받은 초기 좌표
});


// const mapContainer = ref(null);
// const map = ref(null);
const droneModel = ref("");
const targetLat = ref("");
const targetLng = ref("");
const mission = ref("");

watch(
  () => props.initialCoordinates,
  (newCoords) => {
    if (newCoords.lat && newCoords.lng) {
      targetLat.value = newCoords.lat;
      targetLng.value = newCoords.lng;
    }
  },
  { deep: true }
);

const registerDrone = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/drone/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        droneModel: droneModel.value,
        mission: mission.value || null,  // 미션이 없으면 null
        target: targetLat.value && targetLng.value 
          ? { lat: parseFloat(targetLat.value), lng: parseFloat(targetLng.value) } 
          : null, // 좌표가 없으면 null
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
    <h3>임무 배정</h3>
    <form @submit.prevent="registerDrone" class="form-grid">
      <div class="form-group">
        <label for="droneId">드론 모델:</label>
        <input id="droneId" v-model="droneId" type="text" required />
      </div>

      <div class="form-group">
        <label>목표 지점 (lat, lng):</label>
        <div class="coordinate-group">
          <input
            v-model="targetLat"
            type="number"
            step="0.000000000000001"
            required
            placeholder="위도 (Lat)"
          />
          <input
            v-model="targetLng"
            type="number"
            step="0.000000000000001"
            required
            placeholder="경도 (Lng)"
          />
        </div>
      </div>

      <div class="form-group">
        <label>미션:</label>
        <select v-model="mission" required>
          <option value="">Choose the operation goal</option>
          <!-- Default placeholder -->
          <option value="suicide">폭격용</option>
          <option value="reconnaissance">정찰용</option>
          <option value="etc">기타</option>
        </select>
      </div>

      <div v-if="mission === 'etc'" class="form-group">
        <input v-model="customMission" type="text" placeholder="기타 미션 입력" required />
      </div>

      <button type="submit" class="submit-btn">등록</button>
    </form>
  </div>
</template>

<style scoped>
.drone-register {
  width: 100%;
  max-width: 500px;
  margin: 0;
  padding: 20px;
  background: #1c293c;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px; /* Increased font size */
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 16px; /* Increased font size */
  margin-bottom: 5px;
  font-weight: 600;
}

input,
select {
  padding: 12px; /* Increased padding for better usability */
  border-radius: 5px;
  border: none;
  font-size: 16px; /* Increased font size */
  background: #2c3e50;
  color: white;
}

.coordinate-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.coordinate-group input {
  flex: 1;
}

.submit-btn {
  padding: 12px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
  font-size: 16px; /* Increased font size */
}

.submit-btn:hover {
  background-color: #43a047;
}

@media (max-width: 600px) {
  .drone-register {
    padding: 15px;
    max-width: 100%;
  }

  .form-grid {
    gap: 10px;
  }

  input,
  select,
  .submit-btn {
    font-size: 14px; /* Adjust font size for smaller screens */
    padding: 10px;
  }
}
</style>
