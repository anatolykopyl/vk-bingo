<template>
  <div>
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
            v-if="!selectedAnswer" 
            :options="options" 
            @selectedAnswer="selectAnswer" 
          />
        </transition>
        <transition name="spin-result">
          <Result 
            v-if="showResult" 
            :name="card.name" 
            :selectedName="selectedAnswer" 
            :date="card.date" 
            :correct="correctAnswer" 
          />
        </transition>
      </div>
    </div>
    <Score 
      v-if="card" 
      :score="score" 
    />

    <EndGame />

    <square-loader 
      v-if="!card" 
      :color="'#f3f3f3'" 
      class="loader" 
    />
    <Stats />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import List from './List.vue'
import Result from './Result.vue'
import Score from './Score.vue'
import Stats from './Stats.vue'
import EndGame from './EndGame.vue'

import SquareLoader from 'vue-spinner/src/SquareLoader.vue'

const options = ref()
const card = ref()
const correctAnswer = ref()
const selectedAnswer = ref()
const showResult = ref()
const score = reactive({
  "right": 0, 
  "wrong": 0
})

async function getCard() {
  correctAnswer.value = null
  selectedAnswer.value = null
  showResult.value = false
  const response = await axios.get(process.env.VUE_APP_BACKEND + '/card')
  card.value = response.data
}

async function selectAnswer(selection) {
  selectedAnswer.value = selection
  // setTimeout(function() {
  //   showResult.value = true
  //   if (correctAnswer.value) {
  //     score.right++ 
  //   } else {
  //     score.wrong++
  //   }
  // }, 805)

  await axios.post(process.env.VUE_APP_BACKEND + '/answer', {
    'data': {
      'id': card.value._id,
      'name': selectedAnswer.value
    }
  })
}

onMounted(async () => {
  getCard()
  const response = await axios.get(process.env.VUE_APP_BACKEND + '/options')
  options.value = response.data
})
</script>

<style scoped>
.card {
  width: 450px;
  padding: 18px;
  border-radius: 17px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
  background-color: #121212;
  margin: auto;
}

.meme {
  width: 100%;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
}

.interactive {
  position: relative;
  -webkit-perspective: 900000px;
  perspective: 900000px;
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
