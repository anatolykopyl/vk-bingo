<template>
  <div>
    <div
      class="result" 
      :class="{correct: correct === selectedName}"
    >
      <div
        v-show="correct !== selectedName" 
        class="wrong"
      >
        Нет, это был не {{ selectedName }} 😢
      </div>

      {{ correct }}
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
    correct: String
  }
}
</script>

<style scoped>
.result {
  padding: 30px 40px;
  border-radius: 32px;
  background-color: white;
}

.correct {
  color: var(--clr-text);
  background-color: var(--clr-accent);
}

.wrong {
  color: rgb(255, 71, 71);
}
</style>