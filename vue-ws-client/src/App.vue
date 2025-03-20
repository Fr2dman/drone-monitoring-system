<script setup>
import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <header>
    <div class="logo-identity">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <span>MEW - Monitoring & Execution System for Wings</span>
    </div>

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->
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
        <li><RouterLink to="/dashboard">DashBoard</RouterLink></li>
        <li><RouterLink to="/drone-status">Drone Status</RouterLink></li>
        <li><RouterLink to="/mission-status">Mission Status</RouterLink></li>
        <li><RouterLink to="/all-stop">All Stop</RouterLink></li>
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

.root {
  display: flex;
  min-height: 100vh;
}

/* 사이드바 스타일 */
side-bar {
  width: 220px;
  background-color: #1c293c;
  border-radius: 20px;
  color: white;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

side-bar ul {
  list-style: none;
  padding: 10px 0px 10px 0px;

  margin: 20px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

side-bar ul li {
  margin: 15px 0;
}

side-bar ul li a {
  color: white;
  text-decoration: none;
  margin: 10px 15px 0px;
  padding: 10px 8px;
}

side-bar ul li a:hover {
  text-decoration: underline;
}

/* 콘텐츠 영역 */
.content {
  flex-grow: 1;
  background-color: #a3a3a3;
  padding: 20px;
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
