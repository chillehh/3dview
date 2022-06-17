<template>
  <div class="home">
    <h1>Welcome to the home page.</h1>
    <p>This will be where you can upload 3D models</p>
  </div>
  <UploadModel/>
</template>

<script>
import UploadModel from './UploadModel.vue'

export default {
  name: 'HomePage',
  components: {
    UploadModel,
  },
}
</script>

<style scoped>
  .home {
      width: 100%;
      font-family: "Trebuchet MS", Helvetica, sans-serif;
      text-align: center;
  }

  h1 {
      font-size: 64px;
  }

  p {
      font-size: 24px;
  }
</style>
