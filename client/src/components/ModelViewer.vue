<template>
  <div class="viewer">
    <h1>ModelViewer.</h1>
    <p>This will be where you can view 3D models</p>
    <canvas ref="canvas" id="glcanvas"></canvas>
  </div>
</template>

<script>
import GetService from '@/services/GetService'
// import WebglParser from '@/components/webglParser.js'
import {WebglInstance} from '@/webgl/gl.js'
// import { Model } from '@/webgl/Model.js'
import { Camera } from '@/webgl/Camera.js'
import { CameraController } from '@/webgl/CameraController.js'
import { OBJ } from '@/webgl/utils/parseOBJ.js'
import { Render } from '@/webgl/Render.js'
import { GridAxisShader } from '@/webgl/shaders/GridAxisShader.js'
import { TestShader } from '@/webgl/shaders/TestShader.js'
// import { Shader } from '@/webgl/shaders/Shader.js'
// import { ShaderUtil } from '@/webgl/shaders/shaderUtil.js'
// import { Vector3, Matrix } from '@/webgl/Math.js'
// import { Primatives } from '@/webgl/Primatives.js'
import { Model } from '@/webgl/Model'
// import * as mat4 from '@/webgl/gl-matrix'
import { Primatives } from '@/webgl/Primatives'
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
    this.getModel();

    // Load model from primative
    // this.initWebgl()
  },
  methods: {
    getModel() {
      // Call a get route to get the model from the server and load it into webgl
      GetService.getFile(this.modelId)
        .then(r => {
          console.log(r.data)
          // Parse data from .obj to webgl format
          const webglData = OBJ.parseText(r.data, true);
          // const webglData = WebglParser.parseOBJ(r.data);
          // Render model
          this.initWebgl(webglData);
          // WebglParser.render(this.$refs.canvas, webglData)
        });
    },
    initWebgl(webglData) {
      // Setup GLInstance
      this.gl = WebglInstance('glcanvas');
      this.gl.fitScreen(0.65, 0.6);
      this.gl.clearData();
      this.gCamera = new Camera(this.gl);
      this.gCamera.transform.position.set(0, 1, 10);
      this.gCameraCtrl = new CameraController(this.gl, this.gCamera);

      // Load resources
      this.gShader = new TestShader(this.gl, this.gCamera.projectionMatrix);

      this.gModel = new Model(this.gl.createMeshVAO('Model', webglData[0], webglData[1], webglData[2], webglData[3], 3));
      let size = this.gModel.getSize();
      let origin = this.gModel.getOrigin();
      // console.log(centre);
      let currentPos = this.gModel.getPosition();
      // this.gModel.setPosition(0.1, 0.33, -5.6);
      // this.gModel.setPosition(1, 1, 1);
      // this.gModel.addPosition(currentPos[0] - origin.x, currentPos[1] - origin.y, currentPos[2] - origin.z);
      // currentPos = this.gModel.getPosition();
      console.log('position: ', currentPos, ' , size: ', size, ' , worldPosition: ', origin);
      // this.gModel.setScale(0.5, 0.5, 0.5);

      // Setup grid
      this.gGridShader = new GridAxisShader(this.gl, this.gCamera.projectionMatrix);
      this.gGridModel = Primatives.GridAxis.createModel(this.gl, true);
      // this.gGridModel.setPosition(2,2,2)

      // Begin rendering
      this.gRLoop = new Render(this.onRender, 60);
      this.gRLoop.start();
    },
    // eslint-disable-next-line
    onRender(dt) {
      // console.log('rendering frame..', this.gModel)
      // mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
      // mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
      // mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
      // this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, worldMatrix);
      this.gCamera.updateViewMatrix();

      // this.gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
      this.gShader.activate();
      // console.log(this.gshader, this.gCamera.viewMatrix)
      this.gShader.setCameraMatrix(this.gCamera.viewMatrix);

      this.gl.clearColor(0.9, 0.6, 0.2, 1);
      this.gl.clearData();
      this.gShader.renderModel(this.gModel.preRender());

      this.gGridShader.activate();
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
