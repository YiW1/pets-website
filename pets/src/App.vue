<template>
  <div id="app">
    <router-view name='pheader'></router-view>
    <router-view name='side'></router-view>
    <router-view name='main'></router-view>
  </div>
</template>

<script>
import petsHeader from './components/petsHeader'
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%; 
}
</style>
