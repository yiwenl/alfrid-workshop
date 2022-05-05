import {
  GL,
  Draw,
  Geom,
  ShaderLibs,
  FrameBuffer,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import Assets from "./Assets";
import resize from "./utils/resize";
import Scheduler from "scheduling";
import { getColorTheme } from "./utils/ColorTheme";
import { random, saveImage, getDateString } from "./utils";
import Color from "./utils/Color";

import vs from "shaders/cubes.vert";
import fs from "shaders/diffuse.frag";
import Config from "./Config";

import fsRand from "shaders/shape1.frag";

let hasSaved = false;
let canSave = false;

const num = 250;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();

    this.resize();
  }

  _initTextures() {
    this._fboPos = new FrameBuffer(num, num, {
      type: GL.FLOAT,
      minFilter: GL.NEAREST,
      magFilter: GL.NEAREST,
    });
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    this._draw = new Draw()
      .setMesh(Geom.bigTriangle())
      .uniform("uSeed", random())
      .useProgram(ShaderLibs.bigTriangleVert, fsRand);

      /*
    this._fboPos.bind();
    GL.clear(0, 0, 0, 0);
    draw.uniform("uSeed", random()).draw();
    this._fboPos.unbind();*/

    const s = 0.015;
    const mesh = Geom.cube(s, s, s);

    const uv = [];
    const extra = [];
    // instancing
    for (let j = 0; j < num; j++) {
      for (let i = 0; i < num; i++) {
        uv.push([i / num, j / num]);
        extra.push([random(), random(), random()]);
      }
    }
    mesh.bufferInstance(uv, "aUV").bufferInstance(extra, "aExtra");;

    this._drawCubes = new Draw().setMesh(mesh).useProgram(vs, fs);
  }

  update() {
    this._fboPos.bind();
    GL.clear(0, 0, 0, 0);
    this._draw.uniform("uTime", Scheduler.getElapsedTime()*0.35).draw();
    this._fboPos.unbind();
  }

  render() {
    let g = 0.0;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);

    //this._dAxis.draw();
    this._drawCubes.bindTexture("uPosMap", this._fboPos.texture, 0).draw();

    g = 200;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this._fboPos.texture);

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
