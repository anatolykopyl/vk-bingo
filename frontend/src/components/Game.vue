<template>
  <div class="card" v-if="card!==null">
    <img class="meme" v-bind:src="card.image">
    <h2>Кто скинул этот мем?</h2>
    <div class="answers">
      <span class="option" v-for="name in options" :key="name" v-on:click="selectAnswer(name)"
      v-bind:class="{
        correct: correctAnswer && selectedAnswer === name, 
        wrong: selectedAnswer === name && !correctAnswer, 
        highlight_correct: correctAnswer !== null && name === card.name
      }">
        {{ name }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Game',
  data() {
    return {
      options: null,
      card: null,
      correctAnswer: null,    // True or False
      selectedAnswer: null    // Чье-то имя
    }
  },
  methods: {
    getCard: function() {
      axios
        .get('http://localhost:3000/card')
        .then(response => (this.card = response.data))
    },
    selectAnswer: function(selection) {
      if (this.correctAnswer === null) {
        this.correctAnswer = selection === this.card.name
        this.selectedAnswer = selection
      }
    }
  },
  mounted() {
    this.getCard()
    axios
      .get('http://localhost:3000/options')
      .then(response => (this.options = response.data))
  }
}
</script>

<style scoped>
.card {
  width: 50%;
  padding: 18px;
  border-radius: 17px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
  background-color: #121212;
}

.meme {
  width: 100%;
  border-radius: 8px;
}

.answers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.option {
  background-color: #5a5a5a;
  border-radius: 6px;
  margin: 3px;
  padding: 5px 9px 5px 9px;
  transition: transform 0.2s;
}
.option:hover {
  transform: scale(1.06);
  cursor: pointer;
}

.correct {
  background-color: rgb(124, 230, 124);
}
.highlight_correct {
  border: 1px solid rgb(124, 230, 124);
}
.wrong {
  background-color: rgb(255, 71, 71);
}
</style>
