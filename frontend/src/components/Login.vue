<template>
  <div>
    <h1>Авторизация:</h1>
    <p>{{ question }}</p>
    <input v-model="answer"><br>
    <button v-on:click="login" v-bind:class="{wrong: loggedIn === false}">Ввод</button>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  name: 'Login',
  data() {
    return {
      question: null,
      answer: null,
      loggedIn: null
    }
  },
  methods: {
    login: function() {
      axios
        .post(process.env.VUE_APP_BACKEND + '/auth', {
          "pass": this.answer,
        })
        .then(response => {
          this.loggedIn = response.status == "200"
          this.$emit('loggedIn', this.loggedIn)
        })
    }
  },
  mounted() {
    this.question = process.env.VUE_APP_QUESTION
    this.login()
  }
}
</script>

<style scoped>
div {
  background-color: #121212;
  width: 400px;
  margin: auto;
  border-radius: 18px;
  padding: 40px 10px 40px 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
}

input {
  font-size: 1em;
  text-align: center;
  padding: 5px 8px 5px 8px;
  margin-bottom: 1em;
  border-radius: 6px;
  border: none;
  width: 20ch;
}

button {
  color: white;
  font-size: 1em;
  box-sizing: content-box;
  background-color: #5a5a5a;
  border-radius: 6px;
  border: none;
  width: 20ch;
  padding: 5px 8px 5px 8px;
  cursor: pointer;
}
</style>