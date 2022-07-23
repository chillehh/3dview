<template>
  <div class="viewer">
    <canvas ref="canvas" id="glcanvas"></canvas>
    <div class="config">
      <button type="button" id="zoomIn" class="btn btn-dark" @click="zoom(true)">+</button>
      <button type="button" id="zoomOut" class="btn btn-dark" @click="zoom(false)">-</button>
    </div>
  </div>
</template>

<script>
import GetService from '@/services/GetService'
import {WebglInstance} from '@/webgl/gl.js'
import { Camera } from '@/webgl/Camera.js'
import { CameraController } from '@/webgl/CameraController.js'
import { OBJ } from '@/webgl/utils/parseOBJ.js'
import { Render } from '@/webgl/Render.js'
import { GridFloor } from '@/webgl/GridFloor.js'
import { TestShader } from '@/webgl/shaders/TestShader.js'
import { Model } from '@/webgl/Model'
import { Matrix4, Vector3 } from '@/webgl/Math'
// import webglParser from './webglParser'
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
      gGrid: undefined,
    } 
  },
  props: {
    modelId: String
  },
  mounted() {
    // Load model from server
    this.getModel();
  },
  methods: {
    getModel() {
      // Call a get route to get the model from the server and load it into webgl
      GetService.getFile(this.modelId)
        .then(r => {
          console.log(r.data)
          // Parse data from .obj to webgl format
          const webglData = OBJ.parseText(r.data, true);
          // const webglData = webglParser.parseOBJ(r.data);
          // Render model
          this.initWebgl(webglData);
        });
    },
    initWebgl(webglData) {
      // Setup GLInstance
      this.gl = WebglInstance('glcanvas');
      this.gl.fitScreen(1, 1);
      this.gl.clearData();
      this.gCamera = new Camera(this.gl);
      this.gCameraCtrl = new CameraController(this.gl, this.gCamera);

      // Load resources
      this.gShader = new TestShader(this.gl, this.gCamera.projectionMatrix);
      this.gModel = new Model(this.gl.createMeshVAO('Model', webglData[0], webglData[1], webglData[2], webglData[3], 3, true));

      // Setup grid
      this.gGrid = new GridFloor(this.gl, true);
      this.gGrid.transform.scale = new Vector3(20, 20, 20);
      // Set grid position to yMin bounds of model
      let extent = this.gModel.getExtent();
      // Put camera in view and center model
      this.updateCamera(extent);
      // Begin rendering
      this.gRLoop = (new Render(this.onRender, 60)).start();
    },
    updateCamera(extent) {
      const range = new Vector3().subVectors(extent.max, extent.min);
      let modelOffset = new Vector3().addVectors(extent.min, range.multiScalar(0.5));
      modelOffset = modelOffset.multiScalar(-1);
      this.gModel.transform.position = modelOffset;
      // Set grid y to new extent min y pos
      this.gGrid.transform.position.set(0, this.gModel.transform.position.y + (this.gModel.getExtent().min.y), 0);
      // Make sure target is centred at 0
      const target = new Vector3(0, 0, 0);
      // Work out how to move the camera based on the model\
      const radius = range.magnitude() * 2;
      const cameraPos = target.add(new Vector3(0, 0, radius));
      this.gCamera.near = radius / 100;
      this.gCamera.far = radius * 3;
      // console.log(this.gCamera.near, this.gCamera.far);
      const up = new Vector3(0, 1, 0);
      // const fovy = 60 * Math.PI / 180;
      this.gCamera.transform.position = cameraPos;
      // console.log(this.gCamera.transform.position);
      let camMatrix = Matrix4.identity();
      Matrix4.lookAt(cameraPos, target, up, camMatrix);
      Matrix4.invert(this.gCamera.viewMatrix, camMatrix);
    },
    // eslint-disable-next-line
    onRender(dt) {
      this.gCamera.updateViewMatrix();

      this.gShader.activate();
      this.gShader.setCameraMatrix(this.gCamera.viewMatrix);

      // this.gl.clearColor(0.9, 0.6, 0.2, 1);
      this.gl.clearColor(0.4235, 0.4549, 0.5019, 1);
      this.gl.clearData();
      this.gShader.renderModel(this.gModel.preRender());

      this.gGrid.render(this.gCamera);
    },
    zoom(zoomIn) {
      this.gCameraCtrl.onMouseWheel({ wheelDelta: zoomIn ? -1 : 1 })
    },
  },
}
</script>

<style scoped>
  .viewer {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
      font-family: "Trebuchet MS", Helvetica, sans-serif;
  }

  #glcanvas {
    position: relative;
    overflow: hidden;
  }

  .config {
    position: absolute;
    bottom: 0%;
    left: 0%;
  }
</style>

<style>
  html {
    overflow: hidden;
  }
</style>
