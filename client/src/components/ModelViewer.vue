<template>
  <div class="viewer">
    <h1>ModelViewer.</h1>
    <p>This will be where you can view 3D models</p>
    <canvas ref="canvas" id="glcanvas"></canvas>
  </div>
</template>

<script>
import GetService from '@/services/GetService'
import WebglParser from '@/components/webglParser.js'
import {WebglInstance} from '@/webgl/gl.js'
// import { Model } from '@/webgl/Model.js'
import { Camera } from '@/webgl/Camera.js'
import { CameraController } from '@/webgl/CameraController.js'
// import { OBJ } from '@/webgl/utils/parseOBJ.js'
import { Render } from '@/webgl/Render.js'
import { GridAxisShader } from '@/webgl/shaders/GridAxisShader.js'
import { TestShader } from '@/webgl/shaders/TestShader.js'
// import { Shader } from '@/webgl/shaders/Shader.js'
// import { ShaderUtil } from '@/webgl/shaders/shaderUtil.js'
// import { Vector3, Matrix } from '@/webgl/Math.js'
import { Primatives } from '@/webgl/Primatives.js'
export default {
  name: 'ModelViewer',
  data() {
    return {
      loader: -1,
      gl: undefined,
      gRLoop: undefined,
      gShader: undefined,
      gModel: undefined,
      gCamera: undefined,
      gCameraCtrl: undefined,
      gGridShader: undefined,
      gGridModel: undefined
    } 
  },
  props: {
    modelId: String
  },
  mounted() {
    // // inject webgl scripts on component mounted
    // let webglUtils = document.createElement('script')
    // webglUtils.setAttribute('src', 'https://webglfundamentals.org/webgl/resources/webgl-utils.js')
    // document.head.appendChild(webglUtils)
    // webglUtils.onload = () => this.loader += 1
    // let m4 = document.createElement('script')
    // m4.setAttribute('src', 'https://webglfundamentals.org/webgl/resources/m4.js')
    // document.head.appendChild(m4)
    // m4.onload = () => this.loader += 1
    
    // Load model from server
    // this.getModel();

    // Load model from primative
    this.initWebgl()
  },
  methods: {
    getModel() {
      // Call a get route to get the model from the server and load it into webgl
      GetService.getFile(this.modelId)
        .then(r => {
          console.log(r.data)
          // Parse data from .obj to webgl format
          // const webglData = OBJ.parseText(r.data, true);
          const webglData = WebglParser.parseOBJ(r.data);
          // Render model
          this.initWebgl(webglData);
          // WebglParser.render(this.$refs.canvas, webglData)
        });
    },
    initWebgl() {
      // Setup GLInstance
      this.gl = WebglInstance('glcanvas');
      this.gl.fitScreen(0.65, 0.6);
      this.gl.clearData();
      this.gCamera = new Camera(this.gl);
      this.gCamera.transform.position.set(0, 1, 3);
      this.gCameraCtrl = new CameraController(this.gl, this.gCamera);

      // Load resources
      this.gShader = new TestShader(this.gl, this.gCamera.projectionMatrix);
      this.gModel = Primatives.Cube.createModel(this.gl);
      this.gModel.setPosition(0, 0.6, 0);
      this.gModel.setScale(0.5, 0.5, 0.5);

      // Setup grid
      this.gGridShader = new GridAxisShader(this.gl, this.gCamera.projectionMatrix);
      this.gGridModel = Primatives.GridAxis.createModel(this.gl, false);

      // Begin rendering
      this.gRLoop = new Render(this.onRender, 30);
      this.gRLoop.start();
    },
    // eslint-disable-next-line
    onRender(dt) {
      this.gCamera.updateViewMatrix();
      this.gl.clearData();

      this.gGridShader.activate()
      this.gGridShader.setCameraMatrix(this.gCamera.viewMatrix);
      this.gGridShader.renderModel(this.gGridModel.preRender());
      
      // this.gShader.activate();
      // this.gShader.setCameraMatrix(this.gCamera.viewMatrix)
      // this.gShader.renderModel(this.gModel.preRender());
    },
  },
  // watch: {
  //   loader(newVal) {
  //     if (newVal === 1) {
  //       console.log('loaded webgl!')
  //       this.initWebgl(OBJ.parseText())
  //     }
  //   },
  // },
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
