<template>
  <div>
    <h1>Авторизация:</h1>
    <p>{{ question }}</p>
    <input 
      placeholder="Ответ"
      v-model="answer"
    >
    <br>
    <input
      placeholder="Ваше имя"
      v-model="username"
    >
    <br>
    <button 
      @click="login" 
      :class="{ 
        wrong: loggedIn === false
      }"
    >
      Ввод
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '../../store'
import axios from 'axios'
axios.defaults.withCredentials = true

const question = process.env.VUE_APP_QUESTION

const router = useRouter()
const store = useStore()

const answer = ref()
const loggedIn = ref()
const username = ref()

async function login() {
  store.username = username.value

  await axios
    .post(process.env.VUE_APP_BACKEND + '/auth', {
      "pass": answer.value,
    })
    .then(response => {
      loggedIn.value = response.status == "200"
      router.push('/')
    })

  axios
    .post(process.env.VUE_APP_BACKEND + '/connect', {
      'data': {
        'username': username.value
      }
    })
}
</script>

<style scoped>
div {
  background-color: #121212;
  width: 400px;
  margin: auto;
  border-radius: 18px;
  padding: 40px 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
}

input {
  font-size: 1em;
  text-align: center;
  padding: 5px 8px;
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
  padding: 5px 8px;
  cursor: pointer;
}

@media only screen and (max-width: 520px) {
  div {
    width: 100%;
    padding: 40px 0;
  }
}
</style>