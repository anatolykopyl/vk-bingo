<template>
  <div class="authCard">
    <h1>Авторизация:</h1>

    <div class="auth">
      <p>{{ question }}</p>

      <input 
        v-model="answer"
        placeholder="Ответ"
        class="input"
        :class="{
          '-wrong': wrongPassword
        }"
      >

      <input
        v-if="mode === 'player'"
        v-model="username"
        placeholder="Ваше имя"
        class="input"
      >
      
      <button 
        v-if="mode === 'player'"
        class="login"
        :disabled="!username || !answer" 
        @click="loginPlayer"
      >
        Войти как игрок
      </button>
      <button 
        v-else
        class="login"
        :disabled="!answer" 
        @click="loginScreen" 
      >
        Войти как большой экран
      </button>
      
      <button 
        class="switchMode"
        @click="switchMode"
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
const wrongPassword = ref()

function switchMode() {
  mode.value = mode.value === 'player' ? 'screen' : 'player'
}

async function loginPlayer() {
  if (!answer.value || !username.value) {
    return
  }

  store.username = username.value

  try {
    await axios
      .post(import.meta.env.VITE_APP_BACKEND + '/auth', {
        "pass": answer.value,
        "username": username.value,
      })

    router.push('/game')
  } catch {
    wrongPassword.value = true
  }
}

async function loginScreen() {
  store.username = undefined

  try {
    await axios
      .post(import.meta.env.VITE_APP_BACKEND + '/auth', {
        "pass": answer.value,
      })

    router.push('/screen')
  } catch {
    wrongPassword.value = true
  }
}
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
}

.authCard {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--clr-text);
  color: var(--clr-text);
  width: 400px;
  margin: auto;
  border-radius: 32px;
  padding: 40px 40px;
  box-sizing: border-box;
  background: white;
  border: 3px solid var(--clr-text);
  @include filled-shadow(16);
}

.input {
  font-size: 16px;
  padding: 16px;
  border: 2px solid var(--clr-text);
  width: 100%;
  box-sizing: border-box;
  @include filled-shadow(4);
  border-radius: 12px;

  &:focus {
    outline: none;
  }

  &.-wrong {
    border-color: red;
  }
}

.login {
  color: var(--clr-text);
  font-size: 16px;
  box-sizing: border-box;
  background-color: var(--clr-bg);
  border: none;
  width: 100%;
  padding: 16px;
  cursor: pointer;
  border: 2px solid var(--clr-text);
  @include filled-shadow(4);
  border-radius: 12px;

  &:disabled {
    cursor: default;
    color: var(--clr-text-secondary);
  }
}

.switchMode {
  position: absolute;
  color: var(--clr-text);
  background: var(--clr-accent);
  font-size: 12px;
  width: 70px;
  height: 70px;
  border-radius: 100px;
  border: 2px solid var(--clr-text);
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @include filled-shadow(4);
}

@media only screen and (max-width: 520px) {
  .authCard {
    width: calc(100% - 90px);
    margin: auto;
    padding: 40px 20px;
  }
}
</style>