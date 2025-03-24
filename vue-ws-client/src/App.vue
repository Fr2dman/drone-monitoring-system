<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="logo-identity">
      <img src=".\assets\logo.svg" alt="logo" class="logo" />
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
    <nav-bar>
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
          <RouterLink to="/mission-records">
            <span class="material-symbols-outlined"> flag </span>
            <p>Mission Records</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/all-stop">
            <span class="material-symbols-outlined"> stop_circle </span>
            <p>All Stop</p>
          </RouterLink>
        </li>
      </ul>
    </nav-bar>

    <!-- 사이드바 오른쪽에 페이지 내용 -->
    <main class="content">
      <RouterView />
    </main>
  </div>

  <footer></footer>
</template>

<style scoped>
body {
  margin: 0px;
}
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
  width: 80px;
  height: 80px;
}

header .logo-identity {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1rem;
  gap: 1rem;
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

.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 네비게이션바 스타일 */
nav-bar {
  width: 100%;
  height: auto;
  background-color: #1c293c;
  border-radius: 20px;
  color: white;
  margin-bottom: 20px;
  position: relative;

}

nav-bar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap; /* 화면이 작아지면 자동으로 줄 바꿈 */
  justify-content: space-evenly; /* 요소를 균등 배치 */
  gap: 10px; /* 항목 간격 조정 */
}

nav-bar ul li {
  width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

nav-bar ul li a {
  display: flex;
  align-items: center; /* 아이콘과 텍스트 정렬 */
  justify-content: center;
  /* padding: 5px; */
  border-radius: 10px;
  transition: background 0.3s;
  text-decoration: none;
  color: white;
  width: 100%; /* 전체 너비 사용 */
  font-size: 1rem;
  /* gap: 5px; */
}

nav-bar ul li a:hover {
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
  padding: 10px 20px;
  border-radius: 10px;
  position: relative; /* 맵이 포함된 영역을 명확히 정의 */
  overflow: visible;  /* 맵 내부 요소(마커 등)가 잘리지 않도록 설정 */
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
/*
/* 반응형 스타일
@media (max-width: 768px) {
  nav-bar ul {
    /* 모바일에서는 세로 배치
    flex-direction: column; 
    align-items: center;
  }

  nav-bar ul li {
    width: 100%;
     /* 모바일에서는 최대 너비 지정
    max-width: 250px;
  }
}
*/
</style>
