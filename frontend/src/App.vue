<template>
  <h1>🎰 Flex Bingo 🎰</h1>
  <Game id="game" />
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Game
  }
}
</script>

<style>
body {
  margin: 0px;
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
  margin-left: 25%;
  margin-bottom: 100px;
}
</style>
