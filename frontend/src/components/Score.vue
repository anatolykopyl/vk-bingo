<template>
  <div>
    <span class="score-right">{{ score.right }}</span>
    <span class="score-wrong">{{ score.wrong }}</span>
  </div>
</template>

<script>
export default {
  name: "Score",
  props: {
    score: Object
  }
}
</script>

<style scoped>
div {
  width: 350px;
  border-radius: 0 0 17px 17px;
  background-color: #f3f3f3;
  margin: auto;
  padding: 0.4em 18px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-evenly;
}

span {
  font-weight: bold;
}

.score-right {
  color: rgb(124, 230, 124);
}

.score-wrong {
  color: rgb(255, 71, 71);
}

@media only screen and (max-width: 520px) {
  div {
    width: 100%;
    position: fixed;
    padding: 0.4em 0;
    bottom: 0;
    border-radius: 0;
    z-index: 100;
  }
}
</style>