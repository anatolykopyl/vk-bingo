<template>
  <div 
    class="answer"
  >
    {{ props.answer }}
  </div>
</template>

<script setup>
const props = defineProps(["answer"])
</script>

<style scoped lang="scss">
.answer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  box-sizing: border-box;
  background: var(--clr-accent);
  border-radius: 32px;
  font-size: 30px;
  padding: 32px;
  font-weight: 600;
  border: 3px solid var(--clr-text);
  @include filled-shadow(16);
}
</style>