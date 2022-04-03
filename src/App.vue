<template>
  <div style="width:80vw;height:90vh;margin:auto;" >
    <Map ref="map" @route-changed="updateSummary" :initialRoute="points" />
    <div style="text-align:left;">
      Route File: {{selectedFilePath}}
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

export default {
  name: 'App',
  data(){
    return {
      distance: 0,
      selectedFilePath: null,
      points: []
    }
  },

  methods:{

    updateSummary(routeParams){
      this.distance = routeParams.distance.km.toFixed(2);
      this.points = routeParams.points;
    },

    async saveButtonClicked(){

      let filePath = typeof this.selectedFilePath == 'undefined' || this.selectedFilePath == null ? "C:\\" : this.selectedFilePath
      filePath = await window.electronAPI.writeToFile(filePath, JSON.stringify(this.points));
      this.selectedFilePath = filePath;
      if(filePath != null){
         await window.electronAPI.showMessage(`Successfully Saved To: ${this.selectedFilePath}`);
      }
     
     
    },

    async loadButtonClicked(){
      
      const result = await window.electronAPI.openFile();
      
      if(result != null)
      {
        this.selectedFilePath = result.filePath;
        this.points = result.points;
        this.$refs.map.reloadRoute(this.points);
        console.log(`Loaded: JSON.stringify(${JSON.stringify(result.points)}) from result.filePath`);
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
