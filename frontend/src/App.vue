<template>
  <h1>🎰 Флекспатрульное Бинго 🎰</h1>
  <Login id="login" @loggedIn="login" v-show="!loggedIn" />
  <Game id="game" v-if="loggedIn" />
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

.correct {
  color: black;
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
