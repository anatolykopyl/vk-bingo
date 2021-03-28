<template>
  <div>
    <span v-show="!correct" class="wrong-answr">Нет, это был не {{ selectedName }} 😢</span>
    <div class="result" v-bind:class="{correct: correct}">
      {{ name }} {{ date }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Result",
  props: {
    name: String,
    selectedName: String,
    date: String,
    correct: Boolean
  }
}
</script>

<style scoped>
.result {
  padding: 30px 40px 30px 40px;
  border-radius: 8px;
  background-color: #5a5a5a;
}

.wrong-answr {
  color: rgb(255, 71, 71);
}
</style>