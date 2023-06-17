<template>
  <div class="end">
    <button 
      @click="endGame"
      class="endButton"
    >
      Закончить игру
    </button>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter()

function endGame() {
  axios.post(import.meta.env.VITE_APP_BACKEND + '/end')
  router.push('/')
}
</script>

<style scoped lang="scss">
.end {
  // position: fixed;
  // bottom: 8px;
  // left: 50%;
  // transform: translateX(-50%);
}

.endButton {
  background: none;
  border: none;
  font: inherit;
  padding: 8px 12px;
  border-bottom: 1px dotted var(--clr-text);

  &:hover {
    cursor: pointer;
  }
}
</style>