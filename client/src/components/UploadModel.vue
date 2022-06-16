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
        <input @input="file = $event.target.value" type="file" class="custom-file-input" id="uploadFile" required accept=".obj">
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary" type="submit">Upload Model!</button>
      </div>
    </form>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'
import _ from 'lodash'
import UploadService from '@/services/dataService'

export default {
  name: 'UploadModel',
  data() {
    return {
      file: undefined,
    } 
  },
  props: {
    msg: String
  },
  methods: {
    async redirect() {
      console.log('uploaded file: ')
      // TODO: Use route on backend to save to db and then return viewer showing model
      console.log(this.file);
      const result = await UploadService.upload(this.generateId(), this.file);
      console.log(result);
      this.$router.push({ name: 'ThreeDViewer', params: { id: this.generateId() } });
    },
    generateId() {
      return _.toString(uuid()).split('-')[0]
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
