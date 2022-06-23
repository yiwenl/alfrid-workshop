import {
  GL,
  Draw,
  Geom,
  DrawBall,
  DrawAxis,
  DrawCopy,
  DrawCamera,
  Scene,
  CameraOrtho,
  FrameBuffer,
  Object3D,
} from "alfrid";
import Assets from "./Assets";
import resize from "./utils/resize";
import Scheduler from "scheduling";
import { getColorTheme } from "./utils/ColorTheme";
import { saveImage, getDateString } from "./utils";
import Color from "./utils/Color";
import { vec3, mat4 } from "gl-matrix";

import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";

import vsFloor from "shaders/floor.vert";
import fsFloor from "shaders/floor.frag";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    this._lightPos = vec3.fromValues(3, 3, 3);
    this.orbitalControl.rx.value = 0.5;
    this.orbitalControl.ry.value = 0.5;
    this.orbitalControl.radius.value = 15;

    this.mtx = mat4.create();
    this.containerCube = new Object3D();
    this.containerCube.y = 2;
    // this.orbitalControl.lock();

    // shadow
    this.cameraShadow = new CameraOrtho();
    const r = 4;
    this.cameraShadow.ortho(-r, r, r, -r, 1, 12);
    this.cameraShadow.lookAt(this._lightPos, [0, 0, 0]);

    // shadow matrix
    this.shadowMatrix = mat4.create();
    mat4.mul(
      this.shadowMatrix,
      this.cameraShadow.projection,
      this.cameraShadow.view
    );

    this._biasMatrix = mat4.fromValues(
      0.5,
      0.0,
      0.0,
      0.0,
      0.0,
      0.5,
      0.0,
      0.0,
      0.0,
      0.0,
      0.5,
      0.0,
      0.5,
      0.5,
      0.5,
      1.0
    );
    mat4.multiply(this.shadowMatrix, this._biasMatrix, this.shadowMatrix);

    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);
  }

  _initTextures() {
    const fboSize = 1024;

    this._fboShadow = new FrameBuffer(fboSize, fboSize);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();
    this._dCamera = new DrawCamera();

    let s = 2;
    const mesh = Geom.cube(s, s, s);
    this._drawCube = new Draw().setMesh(mesh).useProgram(vs, fs);

    s = 20;
    const meshFloor = Geom.plane(s, s, 1, "xz");
    this._drawFloor = new Draw()
      .setMesh(meshFloor)
      .useProgram(vsFloor, fsFloor);
  }

  update() {
    // update shadow map
    this._fboShadow.bind();
    GL.clear(0, 0, 0, 0);
    GL.setMatrices(this.cameraShadow);
    GL.setModelMatrix(this.containerCube.matrix);
    GL.cullFace(GL.FRONT);
    this._drawCube.draw();
    this._fboShadow.unbind();
    GL.cullFace(GL.BACK);
  }

  render() {
    let g = 0.0;
    GL.clear(g, g, g, 1);
    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._dCamera.draw(this.cameraShadow, [1, 1, 1]);
    this._dBall.draw(this._lightPos, [g, g, g], [1, 1, 0]);

    this.containerCube.rotationY += 0.01;
    GL.setModelMatrix(this.containerCube.matrix);
    this._drawCube.draw();

    GL.setModelMatrix(this.mtx);
    this._drawFloor
      .uniform("uShadowMatrix", this.shadowMatrix)
      .bindTexture("uShadowMap", this._fboShadow.depthTexture, 0)
      .draw();

    g = 300;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this._fboShadow.texture);
    GL.viewport(g, 0, g, g);
    this._dCopy.draw(this._fboShadow.depthTexture);

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    const canvasScale = 2;
    let s = Math.max(canvasScale, devicePixelRatio);
    s = 1;
    const width = w;
    const height = h;
    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
