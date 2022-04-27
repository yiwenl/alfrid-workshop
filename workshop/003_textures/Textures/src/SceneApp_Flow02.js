import {
  GL,
  Draw,
  GLShader,
  ShaderLibs,
  Geom,
  DrawBall,
  DrawAxis,
  DrawCopy,
  FrameBuffer,
  Scene,
} from "alfrid";
import Assets from "./Assets";
import resize from "./utils/resize";
import Scheduler from "scheduling";
import { random, saveImage, getDateString } from "./utils";

import vs from "shaders/basic.vert";
import vsHeight from "shaders/flowheight.vert";
import fs from "shaders/copy.frag";
import fsFlow from "shaders/flow02.frag";
import fsHeight from "shaders/flowheight.frag";

import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();
    // this.orbitalControl.lock();

    this.orbitalControl.rx.value = 0.5;
    this.orbitalControl.ry.value = 0.5;
    this.resize();
  }

  _initTextures() {
    this._texture = Assets.get("flow02");
    this._texture.wrapS = GL.REPEAT;
    this._texture.wrapT = GL.REPEAT;
    this._texture.showProperties();
    // this._texture.minFilter = GL.LINEAR;
    // this._texture.magFilter = GL.LINEAR;

    const fboSize = 512;
    this._fbo = new FrameBuffer(fboSize, fboSize);
  }


  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const s = 8;
    const mesh = Geom.plane(s, s, 1);
    const meshFlowHeight = Geom.plane(s, s*16/9, 400, "xz");
    this._drawPlane = new Draw().setMesh(mesh).useProgram(vs, fs);

    this._drawFlowHeight = new Draw()
      .setMesh(meshFlowHeight)
      .useProgram(vsHeight, fsHeight)


    this._drawFlow = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsFlow)

  }

  update() {
    this._fbo.bind();
    GL.clear(1, 0, 0, 1);
    this._drawFlow.bindTexture("texture", this._texture, 0).uniform("uTime", Scheduler.getElapsedTime() * 1.).draw();
    this._fbo.unbind();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);
    //this._dAxis.draw();
    //this._drawPlane.bindTexture("texture", this._texture, 0).draw();
    //this._drawPlane.bindTexture("texture", this._fbo.texture, 0).draw();
    this._drawFlowHeight.bindTexture("texture", this._fbo.texture, 0).draw();
    //this._drawMountain.bindTexture("texture", this._texture, 0).uniform("uTime", Scheduler.getElapsedTime() * 1.).draw();

    //g = 300;
    //GL.viewport(0, 0, g, g);
    // this._dCopy.draw(this._texture);

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
