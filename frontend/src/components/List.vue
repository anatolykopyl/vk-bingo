<template>
  <div class="answers">
    <span class="option" v-for="name in options" :key="name" v-on:click="selectAnswer(name)">
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    options: Array
  },
  methods: {
    selectAnswer: function(selection) {
      this.$emit('selectedAnswer', selection)
    }
  }
}
</script>

<style scoped>
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
</style>