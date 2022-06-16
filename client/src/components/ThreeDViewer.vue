<template>
  <!-- <div class="input-group">
    <div class="input-group-prepend">
      <button class="btn btn-outline-secondary" type="button">Upload</button>
    </div>
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="uploadFile">
      <label class="custom-file-label" for="uploadFile">Choose file</label>
    </div>
  </div> -->
  <div class="h-100 d-flex align-items-center justify-content-center">
    <form @submit="redirect" class="uploadForm">
      <div class="d-flex justify-content-center">
        <input type="file" class="custom-file-input" id="uploadFile" required accept=".obj">
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary" type="submit">Upload Model!</button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name: 'ThreeDViewer',
  data() {
    return {
      file: undefined,
    } 
  },
  props: {
    msg: String
  },
  methods: {
    redirect() {
      console.log('uploaded file: ')
    },
  },
}
</script>

<style scoped>
  .btn, .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
    margin-top: 50px;
    background-color: rgb(236, 152, 42);
    border-color: rgb(236, 152, 42);
    text-align: center;
  }
</style>
