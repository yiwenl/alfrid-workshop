import {
  GL,
  Draw,
  Geom,
  FrameBuffer,
  ShaderLibs,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import Scheduler from "scheduling";
import { random, saveImage, getDateString } from "./utils";
import Config from "./Config";

import fsHeight from "shaders/height_wave.frag";

import vs from "shaders/cube_wave.vert";
import fs from "shaders/cube_wave.frag";

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
    const fboSize = 512;
    this._fbo = new FrameBuffer(fboSize, fboSize);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._drawHeight = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fsHeight)
      .uniform("uSeed", random(1))
      .uniform("uNoiseScale", random(1, 5));

    // draw cubes
    const s = 0.015;
    const mesh = Geom.cube(s, s, s);
    // const mesh = Geom.plane(s, s, 1, "xy");

    // instancing
    const posOffsets = [];
    const uvs = [];
    const extras = [];
    const num = 600;
    const numy = num* 1.3;
    const startx = -numy * s * 0.5;
    const starty = -num * s * 0.5;
    for (let j = 0; j < numy; j++) {
      for (let i = 0; i < num; i++) {
        posOffsets.push([starty + i * s, 0, startx + j * s]);
        uvs.push([i / num, j / numy]);
        extras.push([random(), random(), random()]);
      }
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(uvs, "aUV")
      .bufferInstance(extras, "aExtra");

    this._drawCubes = new Draw()
      .setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uSize", s);
  }

  update() {
    this._fbo.bind();
    GL.clear(1, 0, 0, 1);
    this._drawHeight.uniform("uTime", Scheduler.getElapsedTime() * 0.1).draw();
    this._fbo.unbind();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);

    //this._dAxis.draw();
    this._drawCubes.bindTexture("texture", this._fbo.texture, 0).uniform("uTime", Scheduler.getElapsedTime() * 0.1).draw();

    g = 300;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this._fbo.texture);

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
