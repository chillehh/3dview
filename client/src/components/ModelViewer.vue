<template>
  <div class="viewer">
    <h1>ModelViewer.</h1>
    <p>This will be where you can view 3D models</p>
  </div>
</template>

<script>

export default {
  name: 'ModelViewer',
  data() {
    return {
      file: undefined,
    } 
  },
  props: {
    modelId: String
  },
  mounted() {
    console.log(this.modelId)
  },
  methods: {
    redirect() {
      console.log('uploaded file: ')
    },
  },
}
</script>

<style scoped>
  .viewer {
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
