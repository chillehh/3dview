<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <form class="uploadForm">
      <div class="d-flex justify-content-center">
        <input ref="fileInput" type="file" class="custom-file-input" id="uploadFile" required accept=".obj">
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary" type="button" @click="redirect">Upload Model!</button>
      </div>
    </form>
  </div>
</template>

<script>
import UploadService from '@/services/UploadService'

export default {
  name: 'UploadModel',
  data() {
    return {
      file: undefined,
    } 
  },
  methods: {
    async redirect() {
      this.file = this.$refs.fileInput.files[0];
      await UploadService.upload(this.file)
        .then(r => {
          this.$router.push({ name: 'ModelViewer', params: { modelId: r.data } });
        });
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
