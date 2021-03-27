<template>
  <h1>🎰 Flex Bingo 🎰</h1>
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
  margin: auto;
  margin-bottom: 100px;
}

.correct {
  background-color: rgb(124, 230, 124) !important;
}
.highlight_correct {
  border: 1px solid rgb(124, 230, 124);
}
.wrong {
  background-color: rgb(255, 71, 71) !important;
}
</style>
