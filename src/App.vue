<template>
  <div style="width:80vw;height:90vh;margin:auto;" >
    <Map @route-changed="updateSummary" :initialRoute="points" />
    <div style="text-align:left;">
       Distance: {{distance}} km
    </div>
   
  </div>
</template>

<script>
import Map from './components/Map.vue'
import Point from "./data/Point"

export default {
  name: 'App',
  data(){
    return {
      distance: 0,
      points: [new Point(50.964962, -114.068001), new Point(50.946991, -114.068137)]
    }
  },

  methods:{

    updateSummary(routeParams){
      this.distance = routeParams.distance.km.toFixed(2);
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
