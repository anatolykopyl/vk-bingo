<template>
  <div class="bar">
    <div 
      class="fill" 
    />
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 16px;
}

.fill {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 16px;
  background: white;
  animation: move 5s linear;
}

@keyframes move {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>