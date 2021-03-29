<template>
  <h1>🎰 Флекспатрульное Бинго 🎰</h1>
  <Login id="login" @loggedIn="login" v-show="!loggedIn" />
  <Game id="game" v-if="loggedIn" />
  <a class="source" href="https://github.com/anatolykopyl/vk-bingo">Исходный код</a>
</template>

<script>
import Login from './components/Login.vue'
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Login,
    Game
  },
  data() {
    return {
      loggedIn: null
    }
  },
  methods: {
    login: function(success) {
      this.loggedIn = success
    }
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
  margin-bottom: 100px;
}

.source {
  color: #f3f3f350;
  background-color: #12121250;
  border-radius: 6px;
  padding: 3px 6px 3px 6px;
  position: fixed;
  width: 20ch;
  left: 0;
  right: 0;
  bottom: 10px;
  text-align: center;
  margin: 0 auto 0 auto;
  transition: all 0.3s;
  cursor: pointer;
  z-index: -1;
}
.source:hover {
  color: #f3f3f3;
  background-color: #121212;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
}

.correct {
  color: #121212;
  background-color: rgb(124, 230, 124) !important;
}
.highlight_correct {
  border: 1px solid rgb(124, 230, 124);
}
.wrong {
  background-color: rgb(255, 71, 71) !important;
}

@media only screen and (max-width: 520) {
  h1 {
    display: none;
    font-size: 10px;
  }
}
</style>
