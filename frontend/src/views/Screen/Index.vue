<template>
  <div
    v-if="card && !loading"
    class="bigScreen"
  >
    <div class="leftWrapper">
      <div class="left">
        <Answer 
          v-if="correctAnswer"
          :answer="correctAnswer"
        />
        
        <img
          class="image"
          :class="{
            '-scoot': correctAnswer
          }"
          :src="card.image"
        >
      </div>
    </div>

    <div class="answersState">
      <div class="users -unanwsered">
        <h2 class="usersTitle">
          Не ответили
        </h2>
        <ul>
          <li
            v-for="user in unansweredPlayers"
            :key="user.name"
            class="user"
          >
            <span>
              {{ user.name }}
            </span>
            <span 
              v-if="score[user.name]"
              class="score"
              :class="{
                '-leader': score[user.name] === maxScore
              }"
            >
              {{ score[user.name] }}
            </span>
          </li>
        </ul>
      </div>

      <div class="users">
        <h2 class="usersTitle">
          Ответили
        </h2>
        <ul>
          <li
            v-for="user in answeredPlayers"
            :key="user.name"
            class="user"
            :class="{
              '-wrong': correctAnswer && user.selected !== correctAnswer,
              '-correct': correctAnswer && user.selected === correctAnswer
            }"
          >
            <span>
              {{ user.name }}
            </span>
            <span 
              v-if="score[user.name]"
              class="score"
              :class="{
                '-leader': score[user.name] === maxScore
              }"
            >
              {{ score[user.name] }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <square-loader 
    v-else
    :color="'white'"
    class="loader"
  />

  <Countdown v-if="correctAnswer" />
  <!-- <FunFact /> -->
  <Transition name="slide-out">
    <div 
      v-if="hurryLast"
      class="hurryLast"
    >
      {{ lastPlayer.name }}, поторопись!
    </div>
  </Transition>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import useServerEvents from '@/composables/useServerEvents'
import Answer from './Answer.vue'
// import FunFact from './FunFact.vue'

import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
import Countdown from '@/components/Countdown.vue'

const { addAnswerListener, addUserlistListener, addRevealListener, addEndListener } = useServerEvents()
const router = useRouter()

const card = ref()
const users = ref([])
const correctAnswer = ref()
const loading = ref()
const score = ref({})
const hurryLast = ref()

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

const maxScore = computed(() => {
  const leader = Object.keys(score.value).sort((a, b) => {
    return score.value[b] - score.value[a]
  })[0]
  return score.value[leader]
})

const lastPlayer = computed(() => {
  if (unansweredPlayers.value.length === 1) {
    return unansweredPlayers.value[0]
  }

  return null
})

let countdownToHurry = undefined
watch(lastPlayer, () => {
  if (!lastPlayer.value) {
    clearTimeout(countdownToHurry)
    hurryLast.value = false
  } else {
    countdownToHurry = setTimeout(() => {
      hurryLast.value = true
    }, 5000)
  }
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
  users.value = []
  data.forEach((name) => {
    users.value.push({
      name,
      selected: null
    })
  })
})

addRevealListener((data) => {
  correctAnswer.value = data.correctAnswer
  score.value = data.score

  clearTimeout(countdownToHurry)
  hurryLast.value = false

  setTimeout(() => {
    getCard()
    correctAnswer.value = null
    users.value = users.value.map((user) => ({
      ...user,
      selected: null
    }))
  }, 5000)
})

addEndListener(() => {
  router.push('/')
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
  gap: 16px;
  align-items: center;
  padding: 8px 8px 24px 8px;
  box-sizing: border-box;
  color: var(--clr-text);
}

.leftWrapper {
  position: relative;
  height: 100%;
  max-width: 60%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.left {
  position: relative;
  max-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: var(--clr-text);
  border: 3px solid var(--clr-text);
  @include filled-shadow(16);
  border-radius: 16px;
  // animation-name: rock;
  // animation-duration: 5s;
  // animation-direction: alternate;
  // animation-iteration-count: infinite;
  // animation-timing-function: ease-in-out;
  transition: transform 1s;

  &.-scoot {
    transform: translateY(150px);
  }
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
  border-right: 1px dashed var(--clr-text);
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.user.-correct {
  color: green;
}

.user.-wrong {
  color: red;
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  width: 16px;
  height: 16px;
  border-radius: 64px;
  border: 2px solid var(--clr-text);
  background: var(--clr-bg);
  color: var(--clr-text);

  &.-leader {
    background: var(--clr-accent);
  }
}

.usersTitle {
  margin: 0;
}

.answersState {
  display: flex;
  flex-shrink: 0;
  height: 400px;
  font-size: 32px;
}

.loader {
  margin-top: 50%;
}

.hurryLast {
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 32px;
  border: 3px solid var(--clr-text);
  @include filled-shadow(16);
  position: fixed;
  right: 32px;
  bottom: 32px;
  background: var(--clr-bg-secondary);
  animation-name: pulse;
  animation-delay: 10s;
  animation-duration: 100s;
  animation-fill-mode: forwards;
  transition: transform 1s;
}

.slide-out-enter-from,
.slide-out-leave-to {
  transform: translateY(200px);
}

@keyframes pulse {
  from {
    background: var(--clr-bg-secondary);
  }

  to {
    background: red;
  }
}
</style>