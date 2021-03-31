<template>
  <div>
    <span>🎭 <small>Самый непредсказуемый:</small> <b>{{ mostOriginal }}</b> 🎭</span><br>
    <span>🪂 <small>Самый стабильный:</small> <b>{{ mostPredictable }}</b> 🪂</span>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Stats',
  data() {
    return {
      stats: {}
    }
  },
  computed: {
    mostOriginal: function() {
      let value = 1
      let returnName

      for (const name in this.stats) {
        if (this.stats[name] < value) {
          value = this.stats[name]
          returnName = name
        }
      }

      return returnName
    },
    mostPredictable: function() {
      let value = 0
      let returnName

      for (const name in this.stats) {
        if (this.stats[name] > value) {
          value = this.stats[name]
          returnName = name
        }
      }

      return returnName
    }
  },
  mounted() {
    axios
        .get(process.env.VUE_APP_BACKEND + '/stats')
        .then(response => {
          response.data.forEach(element => {
            this.stats[element._id] = element.correct / element.wrong
          });
        })
  }
}
</script>

<style scoped>
div {
  width: auto;
  position: fixed;
  top: 0;
  right: 0;
  margin: 2em;
  padding: 1em;
  background-color: #121212;
  border-radius: 7px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
}

@media screen and (max-width: 486px) {
  div {
    width: 100%;
    position: relative;
    padding: 1em 0px 1em 0px;
    margin: 1em 0px 0px 0px;
    border-radius: 17px;
  }
}
</style>