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

import vsPattern from "shaders/flow01.vert";
import fsPattern from "shaders/flow01.frag";

import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();
    this.camera;
    // this.orbitalControl.lock();

    //this.orbitalControl.rx.value = 0.5;
    //this.orbitalControl.ry.value = 0.5;
    this.resize();
  }

  _initTextures() {
    this._texture = Assets.get("flow01");
    this._texture.wrapS = GL.REPEAT;
    this._texture.wrapT = GL.REPEAT;
    this._texture.showProperties();
    // this._texture.minFilter = GL.LINEAR;
    // this._texture.magFilter = GL.LINEAR;
  }


  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const s = 8;
    const meshPattern = Geom.plane(s*16/9, s, 1, "xy");

    this._drawPattern = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsPattern)
      .uniform("uSeed", random(1))
      .uniform("uNoiseScale", random(1, 5))
      .uniform("uRandom", random(1, 1000))
  }

  update() {
  }

  render() {
    let g = 0.;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera)
    this._drawPattern.bindTexture("texture", this._texture, 0).uniform("uTime", Scheduler.getElapsedTime() * 1.).draw();

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
