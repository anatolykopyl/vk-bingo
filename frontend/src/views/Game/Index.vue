<template>
  <h1 class="header">Флекспатруль мультиплеер</h1>

  <div class="main">
    <div 
      class="card" 
      v-if="card"
    >
      <img 
        class="meme" 
        :src="card.image"
      >
      <h2>Кто скинул этот мем?</h2>
      <div class="interactive">
        <transition name="fade-answers" mode="out-in">
          <List
            v-if="!showResult"
            :options="options" 
            @selectedAnswer="selectAnswer" 
          />
          <Result 
            v-else 
            :selectedName="selectedAnswer" 
            :correct="correctAnswer"
          />
        </transition>
      </div>
    </div>

    <EndGame />

    <square-loader 
      v-if="!card" 
      :color="'white'" 
      class="loader" 
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import List from './List.vue'
import Result from './Result.vue'
import EndGame from './EndGame.vue'
import useStore from '@/store'
import useServerEvents from '@/composables/useServerEvents'

import SquareLoader from 'vue-spinner/src/SquareLoader.vue'

const store = useStore()
const { addRevealListener } = useServerEvents()

const options = ref()
const card = ref()
const correctAnswer = ref()
const selectedAnswer = ref()
const showResult = ref()

addRevealListener((data) => {
  showResult.value = true
  correctAnswer.value = data.correctAnswer

  setTimeout(() => {
    getCard()
  }, 5000)
})

async function getCard() {
  correctAnswer.value = null
  selectedAnswer.value = null
  showResult.value = false
  card.value = null
  const response = await axios.get(import.meta.env.VITE_APP_BACKEND + '/card')
  card.value = response.data
}

async function selectAnswer(selection) {
  selectedAnswer.value = selection

  await axios.post(import.meta.env.VITE_APP_BACKEND + '/answer', {
    'data': {
      'id': card.value._id,
      'name': selectedAnswer.value,
      'username': store.username
    }
  })
}

onMounted(async () => {
  getCard()
  const response = await axios.get(import.meta.env.VITE_APP_BACKEND + '/options')
  options.value = response.data
})
</script>

<style scoped lang="scss">
.header {
  padding: 60px;
  margin: auto;
  height: 42px;
}

.main {
  position: relative;
  min-height: calc(100vh - 162px);
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card {
  width: 450px;
  margin: 0 auto;
  min-height: 0;
}

.meme {
  width: 100%;
  border-radius: 32px;
  border: 3px solid var(--clr-text);
  @include filled-shadow(16);
  transform: translateX(-8px);
}

.clickable {
  cursor: pointer;
}

.interactive {
  position: relative;
}

.fade-answers-leave-active {
  transition: all 0.8s ease;
}
.fade-answers-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.loader {
  margin-top: 100px;
}

@media screen and (max-width: 520px) {
  .card {
    width: 94%;
    padding: 3%;
  }
}
</style>
