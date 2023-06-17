<template>
  <h1>Флекспатруль мультиплеер</h1>

  <div class="authCard">
    <h1>Авторизация:</h1>

    <div class="auth">
      <p>{{ question }}</p>
      <input 
        placeholder="Ответ"
        v-model="answer"
      >
      <input
        v-if="mode === 'player'"
        placeholder="Ваше имя"
        v-model="username"
      >
      
      <button 
        v-if="mode === 'player'"
        @click="loginPlayer" 
      >
        Войти как игрок
      </button>
      <button 
        v-else
        @click="loginScreen" 
      >
        Войти как большой экран
      </button>
      
      <button 
        @click="switchMode"
        class="secondary"
      >
        Я не {{ mode === 'player' ? 'игрок' : 'большой экран' }}!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '../../store'
import axios from 'axios'
axios.defaults.withCredentials = true

const question = import.meta.env.VITE_APP_QUESTION

const router = useRouter()
const store = useStore()

const mode = ref("player")
const answer = ref()
const username = ref()

function switchMode() {
  mode.value = mode.value === 'player' ? 'screen' : 'player'
}

async function loginPlayer() {
  store.username = username.value

  await axios
    .post(import.meta.env.VITE_APP_BACKEND + '/auth', {
      "pass": answer.value,
      "username": username.value,
    })
  
  router.push('/game')
}

async function loginScreen() {
  store.username = undefined

  await axios
    .post(import.meta.env.VITE_APP_BACKEND + '/auth', {
      "pass": answer.value,
    })
  
  router.push('/screen')
}
</script>

<style scoped>
.auth {
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
}

.authCard {
  background-color: #121212;
  color: white;
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

button.secondary {
  background: #919191;
  font-size: 12px;
}

@media only screen and (max-width: 520px) {
  div {
    width: 100%;
    padding: 40px 0;
  }
}
</style>