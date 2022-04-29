import {
  GL,
  Draw,
  Geom,
  FrameBuffer,
  DrawBall,
  DrawDotsPlane,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { saveImage, getDateString } from "./utils";

import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.ry.value = 0.3;
    this.resize();
  }

  _initTextures() {
    this.resize();
    const fboSize = 1024;
    this._fbo = new FrameBuffer(fboSize, fboSize, {}, 2);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();
    this._dDotsPlane = new DrawDotsPlane();

    const mesh = Geom.cube(1, 1, 1);
    this._drawCube = new Draw().setMesh(mesh).useProgram(vs, fs);
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);

    this._fbo.bind();
    GL.clear(0, 0, 0, 0);
    this._dAxis.draw();
    this._dDotsPlane.draw();
    this._drawCube.draw();
    this._fbo.unbind();

    const { width, height } = GL;
    GL.viewport(0, 0, width / 2, height / 2);
    this._dCopy.draw(this._fbo.getTexture(0));
    GL.viewport(width / 2, 0, width / 2, height / 2);
    this._dCopy.draw(this._fbo.getTexture(1));

    g = 300;
    GL.viewport(0, 0, g, g);

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
