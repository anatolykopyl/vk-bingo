<template>
  <router-view />
</template>

<script setup>

</script>

<style>
@font-face {
  font-family: "Pangram Sans Rounded";
  font-weight: bold;
  src: local("Pangram Sans Rounded"), url("/fonts/PPPangramSansRounded-Bold.otf") format("opentype");
}

@font-face {
  font-family: "Pangram Sans Rounded";
  font-weight: 600;
  src: local("Pangram Sans Rounded"), url("/fonts/PPPangramSansRounded-Semibold.otf") format("opentype");
}

@font-face {
  font-family: "Pangram Sans Rounded";
  font-weight: normal;
  src: local("Pangram Sans Rounded"), url("/fonts/PPPangramSansRounded-Medium.otf") format("opentype");
}

:root {
  --clr-bg: #ffd537;
  --clr-accent: #37ffac;
}

body {
  margin: 0;
  background-color: var(--clr-bg);
}

#app {
  font-family: "Pangram Sans Rounded", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  margin-top: 60px;
}

#game {
  margin-bottom: 100px;
}
</style>
