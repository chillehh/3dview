<template>
  <div class="home">
    <h1>Welcome to the home page.</h1>
    <p>This will be where you can upload and view 3D models</p>
    <form ref='uploadForm' 
        id='uploadForm' 
        action='http://localhost:8000/upload'
        method='post'
        encType="multipart/form-data">
        <input type="file" name="fileInput" accept=".obj"/>
        <input type="submit" value="upload"/>
    </form>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      file: undefined,
    } 
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .center {
      width: 100%;
      height: 50%;
      margin: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
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
