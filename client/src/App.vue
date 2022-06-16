<template>
  <HomePage/>
  <UploadModel/>
</template>

<script>
import HomePage from './components/HomePage.vue'
import UploadModel from './components/UploadModel.vue'

export default {
  name: 'App',
  components: {
    HomePage,
    UploadModel
  }
}
</script>

<style scoped>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
