<template>
  <div style="width:80vw;height:90vh;margin:auto;" >
    <Map @route-changed="updateSummary" :initialRoute="points" />
    <div style="text-align:left;">
      Name of File: SomeFile
    </div>
    <div style="text-align:left;">
       Distance: {{distance}} km
    </div>
    <div style="text-align:left;">
      <button @click="saveButtonClicked" style="margin-right:5%">Save</button>
      <button @click="loadButtonClicked">Load</button>
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
      selectedFilePath: null,
      points: [new Point(50.964962, -114.068001), new Point(50.946991, -114.068137)]
    }
  },

  methods:{

    updateSummary(routeParams){
      this.distance = routeParams.distance.km.toFixed(2);
    },

    async saveButtonClicked(){
     await window.electronAPI.writeToFile(this.selectedFilePath, "Hello New File!");
    },

    async loadButtonClicked(){
      
      const result = await window.electronAPI.openFile();

      if(result != null)
      {
        this.selectedFilePath = result;
        console.log("Save! " + result);
      }
     
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
