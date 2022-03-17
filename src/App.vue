<template>
  <div style="width:80vw;height:90vh;margin:auto;" >
    <Map :initialRoute="points" />
  </div>
</template>

<script>
import Map from './components/Map.vue'
import Point from "./data/Point"

export default {
  name: 'App',
  data(){
    return {
      points: [new Point(50.968211, -114.0687), new Point(50.965225, -114.068127)]
    }
  },

  components: {
    Map
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
