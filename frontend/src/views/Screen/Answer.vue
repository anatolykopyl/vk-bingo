<template>
  <div 
    class="answer"
    :style="{
      transform: `translate(${-50}%, ${-50}%) rotate(${position.rotation}deg)`
    }"
  >
    {{ props.answer }}
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps(["answer"])
const position = reactive({
  rotation: Math.random() * 20 - 10,
})
</script>

<style scoped lang="scss">
.answer {
  position: fixed;
  background: var(--clr-accent);
  border-radius: 32px;
  font-size: 30px;
  padding: 32px;
  border: 3px solid var(--clr-text);
  top: 50%;
  left: 50%;
  font-weight: 600;
}
</style>