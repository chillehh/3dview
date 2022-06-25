<template>
  <div class="viewer">
    <h1>ModelViewer.</h1>
    <p>This will be where you can view 3D models</p>
    <canvas ref="canvas" id="glcanvas"></canvas>
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
import { Vector3 } from '@/webgl/Math'
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
          const webglData = OBJ.parseText(r.data, false);
          // const webglData = webglParser.parseOBJ(r.data);
          // Render model
          this.initWebgl(webglData);
        });
    },
    initWebgl(webglData) {
      // Setup GLInstance
      this.gl = WebglInstance('glcanvas');
      this.gl.fitScreen(0.65, 0.8);
      this.gl.clearData();
      this.gCamera = new Camera(this.gl);
      this.gCamera.transform.position.set(0, 0.5, 3.5);
      this.gCamera.transform.rotation.set(0, 34, 0);
      this.gCameraCtrl = new CameraController(this.gl, this.gCamera);

      // Load resources
      this.gShader = new TestShader(this.gl, this.gCamera.projectionMatrix);

      this.gModel = new Model(this.gl.createMeshVAO('Model', webglData[0], webglData[1], webglData[2], webglData[3], 3, true));
      let size = this.gModel.getSize().magnitude();
      let origin = this.gModel.getOrigin();
      let centre = this.gModel.getCentre();
      let currentPos = this.gModel.getPosition();
      this.gModel.setPosition(0, 0.6, 0);
      console.log('position: ', currentPos, ' , size: ', size, ' , center: ', centre, ' , origin: ', origin);
      this.gModel.setScale(0.5, 0.5, 0.5);
      this.gModel.transform.rotation = new Vector3(180, 90, 180);

      // Setup grid
      this.gGrid = new GridFloor(this.gl, true);
      this.gGrid.transform.scale = new Vector3(20, 20, 20);

      // Begin rendering
      this.gRLoop = (new Render(this.onRender, 60)).start();
    },
    // updateCamera(size, centre) {
    //   const halfFitScreenSize = size * 0.5;
    //   const halfFovY = (this.gCamera.fov * 0.5) * (Math.PI / 180);
    //   const distance = halfFitScreenSize / Math.tan(halfFovY);
    //   // calculate unit vector that points in the direction the camera is now from the centre of the model
    //   const direction = (new Vector3(0, 0, 0)).sub(this.gCamera.transform.position, centre).normalize();
    //   // move camera to a position distance units away from centre in whatever direction the camera was from the centre already
    //   // this.gCamera.transform.position.set(direction.multiScalar(distance).add(centre));
    //   // // get near and far values for the frustum that will contain the model within it
    //   // this.gCamera.near = size / 100;
    //   // this.gCamera.far = size * 100;
    //   // this.gCamera.updateProjectionMatrix();
    // },
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
