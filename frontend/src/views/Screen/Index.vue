<template>
  <div v-if="card">
    <img
      :src="card.image"
    >
    <div>
      {{ users }}
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import useServerEvents from '../../composables/useServerEvents';

const { addAnswerListener, addUserlistListener } = useServerEvents()

addAnswerListener(console.log)

const card = ref()
const users = ref([])

async function getCard() {
  const response = await axios.get(process.env.VUE_APP_BACKEND + '/card')
  card.value = response.data
}

addUserlistListener((data) => {
  users.value = data
})

onMounted(() => {
  getCard()
})
</script>
