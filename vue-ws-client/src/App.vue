<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="logo-identity">
      <img src="C:\Users\SSAFY\Desktop\codes\drone-monitoring-system\vue-ws-client\src\assets\logo.svg" alt="logo" class="logo">
      <span>MEW - Monitoring & Execution System for Wings</span>
    </div>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div class="root">
    <!-- 사이드바 -->
    <side-bar>
      <ul>
        <li>
          <RouterLink to="/dashboard">
            <span class="material-symbols-outlined"> space_dashboard </span>
            <p>DashBoard</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/drone-status">
            <span class="material-symbols-outlined"> flight </span>
            <p>Drone Status</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/mission-status">
            <span class="material-symbols-outlined"> flag </span>
            <p>Mission Situation</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/all-stop">
            <span class="material-symbols-outlined"> stop_circle </span>
            <p>All Stop</p>
          </RouterLink>
        </li>
      </ul>
    </side-bar>

    <!-- 사이드바 오른쪽에 페이지 내용 -->
    <main class="content">
      <RouterView />
    </main>

  </div>

  <footer></footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.logo {
  border-radius: 20px;
  margin: 0 1rem 0 0;
  width: 100px;
  height: 100px;
}

header .logo-identity {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 20px;
  /* color: rgb(31, 31, 31); */
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  display: flex;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

/* 사이드바 스타일 */
side-bar {
  width: 220px;
  min-width: 220px;
  background-color: #1c293c;
  border-radius: 20px;
  color: white;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

side-bar ul {
  list-style: none;
  padding: 10px 0px 10px 10px;
  margin: 20px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

side-bar ul li {
  width: 200px;
  margin: 15px 0;
  display: flex;
}

side-bar ul li a {
  display: flex;
  align-items: center; /* 아이콘과 텍스트 정렬 */
  padding: 10px;
  border-radius: 10px;
  transition: background 0.3s;
  text-decoration: none;
  color: white;
  width: 100%; /* 전체 너비 사용 */
}

side-bar ul li a:hover {
  text-decoration: underline;
  border-radius: 10px;
}

li span {
  margin-right: 10px;
}

/* 콘텐츠 영역 */
.content {
  flex-grow: 1;
  background-color: #a3a3a3;
  padding: 10px 20px 10px 20px;
  border-radius: 10px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    justify-content: space-between;
  }

  .logo {
    margin: 0 1rem 0 0;
  }

  header .logo-identity {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    /* flex-wrap: wrap; */
  }

  nav {
    text-align: left;
    font-size: 1rem;

    padding: 1rem 0;
  }
}

</style>
