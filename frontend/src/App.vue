<template>
  <h1>Флекспатруль мультиплеер</h1>
  
  <router-view />

  <a
    class="source" 
    href="https://github.com/anatolykopyl/vk-bingo"
    target="_blank"
  >
    Исходный код
  </a>
</template>

<script setup>

</script>

<style>
body {
  margin: 0;
  background-color: #5a5a5a;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f3f3f3;
  margin-top: 60px;
}

#game {
  margin-bottom: 100px;
}

.source {
  color: #f3f3f350;
  background-color: #12121250;
  border-radius: 6px;
  padding: 3px 6px;
  position: fixed;
  width: 20ch;
  left: 0;
  right: 0;
  bottom: 10px;
  text-align: center;
  margin: 0 auto;
  transition: all 0.3s;
  cursor: pointer;
  z-index: -1;
}
.source:hover {
  color: #f3f3f3;
  background-color: #121212;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
}

@media only screen and (max-width: 520px) {
  .source {
    display: none;
  }
}
</style>
