<template>
  <div class="viewer">
    <h1>ModelViewer.</h1>
    <p>This will be where you can view 3D models</p>
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script>
import GetService from '@/services/GetService'
import WebglParser from '@/components/webglParser.js'
export default {
  name: 'ModelViewer',
  data() {
    return {
      loader: -1
    } 
  },
  props: {
    modelId: String
  },
  mounted() {
    // inject webgl scripts on component mounted
    let webglUtils = document.createElement('script')
    webglUtils.setAttribute('src', 'https://webglfundamentals.org/webgl/resources/webgl-utils.js')
    document.head.appendChild(webglUtils)
    webglUtils.onload = () => this.loader += 1
    let m4 = document.createElement('script')
    m4.setAttribute('src', 'https://webglfundamentals.org/webgl/resources/m4.js')
    document.head.appendChild(m4)
    m4.onload = () => this.loader += 1
  },
  methods: {
    initWebgl() {
      // Call a get route to get the model from the server and load it into webgl
      GetService.getFile(this.modelId)
        .then(r => {
          console.log(r.data)
          // Parse data from .obj to webgl format
          const webglData = WebglParser.parseOBJ(r.data)
          // Render model
          WebglParser.render(this.$refs.canvas, webglData)
        });
    },
  },
  watch: {
    loader(newVal) {
      if (newVal === 1) {
        console.log('loaded webgl!')
        this.initWebgl()
      }
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

  #canvas {
    width: 100%;
    height: 100%;
  }
</style>
