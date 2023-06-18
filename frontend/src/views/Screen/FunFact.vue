<template>
  <div class="funFact">
    {{ fact }}
  </div>
</template>

<script setup>
const facts = [
  "Дима – главный источник мемов. Он скинул в конфу 2552 пикчи, это 47% от общего числа!",
  "Всего в конфу было скинуто 5420 картинок!",
  "Раньше флекспатруль носил название dayzspeak.ts3.pw",
  "Конфе с мемами больше семи лет!"
]

const fact = facts[Math.floor(Math.random() * facts.length)];
</script>

<style scoped lang="scss">
.funFact {
  position: fixed;
  padding: 32px;
  right: 0;
  bottom: 0;
  text-align: right;
  width: 200px;
  color: var(--clr-text-secondary);
}
</style>