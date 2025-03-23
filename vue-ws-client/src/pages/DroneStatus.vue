<script setup>
import { ref } from "vue";
import DroneRegister from "@/components/DroneRegister.vue";
import DroneList from "@/components/DroneList.vue";
import DroneStatusInfo from "@/components/DroneStatus/DroneStatusInfo.vue";

const message = "This is Drone Status";
</script>

<template>
  <main>
    <h2>{{ message }}</h2>
    <div class="drone-status-container">
      <DroneRegister />
      <DroneList />
      <DroneStatusInfo />
    </div>
  </main>
</template>

<style scoped>
.drone-status-container {
  display: flex;
}
</style>
