<template>
  <div
    v-if="card && !loading"
    class="bigScreen"
  >
    <img
      class="image"
      :src="card.image"
    >

    <div class="answersState">
      <div class="users -unanwsered">
        <h2 class="usersTitle">Не ответили</h2>
        <ul>
          <li
            class="user"
            v-for="user in unansweredPlayers"
            :key="user.name"
          >
            {{ user.name }}
          </li>
        </ul>
      </div>

      <div class="users">
        <h2 class="usersTitle">Ответили</h2>
        <ul>
          <li
            class="user"
            v-for="user in answeredPlayers"
            :key="user.name"
            :class="{
              '-wrong': correctAnswer && user.selected !== correctAnswer,
              '-correct': correctAnswer && user.selected === correctAnswer
            }"
          >
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>

    <Answer 
      v-if="correctAnswer"
      :answer="correctAnswer"
    />
  </div>

  <square-loader 
    v-else
    :color="'white'"
    class="loader"
  />
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import useServerEvents from '@/composables/useServerEvents'
import Answer from './Answer.vue'

import SquareLoader from 'vue-spinner/src/SquareLoader.vue'

const { addAnswerListener, addUserlistListener, addRevealListener } = useServerEvents()

const card = ref()
const users = ref([])
const correctAnswer = ref()
const loading = ref()

async function getCard() {
  loading.value = true
  const response = await axios.get(import.meta.env.VITE_APP_BACKEND + '/card')
  loading.value = false
  card.value = response.data
}

async function getPlayers() {
  const response = await axios.get(import.meta.env.VITE_APP_BACKEND + '/players')
  response.data.forEach((name) => {
    users.value.push({
      name,
      selected: null
    })
  })
}

const answeredPlayers = computed(() => {
  return users.value.filter((user) => user.selected)
})

const unansweredPlayers = computed(() => {
  return users.value.filter((user) => !user.selected)
})

addAnswerListener((data) => {
  users.value = users.value.map((user) => {
    if (user.name === data.username) {
      return {
        ...user,
        selected: data.selected
      }
    }

    return user
  })
})

addUserlistListener((data) => {
  data.forEach((name) => {
    users.value.push({
      name,
      selected: null
    })
  })
})

addRevealListener((data) => {
  correctAnswer.value = data.correctAnswer

  setTimeout(() => {
    getCard()
    correctAnswer.value = null
    users.value = users.value.map((user) => ({
      ...user,
      selected: null
    }))
  }, 5000)
})

onMounted(() => {
  getCard()
  getPlayers()
})
</script>

<style scoped lang="scss">
.bigScreen {
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-evenly;
  gap: 64px;
  align-items: center;
  padding: 64px;
  background: var(--clr-bg);
  box-sizing: border-box;
  color: black;
}

.image {
  display: block;
  max-width: 60%;
  max-height: 100%;
  object-fit: contain;
  margin-top: auto;
  margin-bottom: auto;
  border: 3px solid black;
  @include filled-shadow(16);
  border-radius: 64px;
  animation-name: rock;
  animation-duration: 5s;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes rock {
  from {
    transform: rotate(-2deg);
  }

  to {
    transform: rotate(2deg);
  }
}

.users {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 20px;
}

.users.-unanwsered {
  border-right: 1px dashed black;
}

.user.-correct {
  color: green;
}

.user.-wrong {
  color: red;
}

.usersTitle {
  margin: 0;
}

.answersState {
  display: flex;
  flex-shrink: 0;
  height: 300px;
}

.loader {
  margin-top: 50%;
}
</style>