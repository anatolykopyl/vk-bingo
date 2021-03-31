<template>
  <div>
    <div class="card" v-if="card !== null" v-on:click="nextCard()" v-bind:class="{clickable: showResult}">
      <img class="meme" v-bind:src="card.image">
      <h2>Кто скинул этот мем?</h2>
      <div class="interactive">
        <transition name="fade-answers">
          <List v-if="selectedAnswer === null" 
          :options="options" @selectedAnswer="selectAnswer" />
        </transition>
        <transition name="spin-result">
          <Result v-if="showResult" 
          :name="card.name" :selectedName="selectedAnswer" :date="card.date" :correct="correctAnswer" />
        </transition>
      </div>
    </div>
    <Score :score="score" />
    <square-loader v-if="card === null" :color="'#f3f3f3'" class="loader" />
  </div>
</template>

<script>
import axios from 'axios'
import List from './List.vue'
import Result from './Result.vue'
import Score from './Score.vue'

import SquareLoader from 'vue-spinner/src/SquareLoader.vue'

export default {
  name: 'Game',
  components: {
    List,
    Result,
    Score,
    SquareLoader
  },
  props: {
    score: Object
  },
  data() {
    return {
      options: null,
      card: null,
      oldCard: null,
      correctAnswer: null,    // True or False
      selectedAnswer: null,   // Чье-то имя
      showResult: false
    }
  },
  methods: {
    getCard: function() {
      this.correctAnswer = null
      this.selectedAnswer = null
      this.showResult = false
      axios
        .get(process.env.VUE_APP_BACKEND + '/card')
        .then(response => {
          this.card = response.data
        })
    },
    nextCard: function() {
      if (this.showResult) {
        this.card = null
        this.getCard()
      }
    },
    selectAnswer: function(selection) {
      this.correctAnswer = selection === this.card.name
      this.selectedAnswer = selection
      let innerThis = this
      setTimeout(function() {
          innerThis.showResult = true
          if (innerThis.correctAnswer) {
            innerThis.score.right++ 
          } else {
            innerThis.score.wrong++
          }
      }, 805)
      this.oldCard = this.card
      axios
        .post(process.env.VUE_APP_BACKEND + '/answer', {
          'data': {
            'correct': this.correctAnswer,
            'selected': this.selectedAnswer
          }
        })
    }
  },
  mounted() {
    this.getCard()
    axios
      .get(process.env.VUE_APP_BACKEND + '/options')
      .then(response => (this.options = response.data))
  }
}
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

@media screen and (max-width: 486px) {
  .card {
    width: 94%;
    padding: 3%;
  }
}
</style>
