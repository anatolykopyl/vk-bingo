<template>
  <h1>Флекспатруль мультиплеер</h1>

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
        <transition name="fade-answers">
          <List
            v-if="!showResult"
            :options="options" 
            @selectedAnswer="selectAnswer" 
          />
        </transition>
        <transition name="spin-result">
          <Result 
            v-if="showResult" 
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
.main {
  padding-bottom: 200px;
}

.card {
  width: 450px;
  margin: auto;
}

.meme {
  width: 100%;
  border-radius: 32px;
  border: 3px solid black;
  @include filled-shadow(16);
  transform: translateX(-8px);
}

.clickable {
  cursor: pointer;
}

.interactive {
  position: relative;

  > * {
    position: absolute;
    width: 100%;
  }
}

.fade-answers-leave-active {
  transition: all 0.8s ease;
}
.fade-answers-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.spin-result-enter-active {
  transition: all 2s ease;
}
.spin-result-enter-from {
  transform: scale(0.2);
  transform: rotateY(120deg);
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
