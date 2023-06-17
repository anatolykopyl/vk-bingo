<template>
  <div 
    class="answers"
  >
    <span 
      class="option" 
      v-for="name in options" 
      :key="name" 
      @click="selectAnswer(name)"
      :class="{
        '-selected': selection === name
      }"
    >
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    options: Array
  },
  data() {
    return {
      selection: null
    }
  },
  methods: {
    selectAnswer: function(selection) {
      if (this.selection) {
        return
      }

      this.selection = selection
      this.$emit('selectedAnswer', selection)
    }
  }
}
</script>

<style scoped>
.answers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 3px;
}

.option {
  background-color: white;
  border-radius: 6px;
  padding: 2px 6px;
  transition: transform 0.2s;
  border: 3px dashed transparent;
}

.option.-selected {
  border-color: var(--clr-accent);
}

.option:hover {
  transform: scale(1.06);
  cursor: pointer;
}
</style>