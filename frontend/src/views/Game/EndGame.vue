<template>
  <div>
    <button @click="endGame">
      Закончить игру
    </button>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter()

function endGame() {
  axios.post(process.env.VUE_APP_BACKEND + '/end')
  router.push('/login')
}
</script>
