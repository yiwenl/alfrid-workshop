import {
  GL,
  Draw,
  Geom,
  ShaderLibs,
  FboPingPong,
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

import vsPass from "shaders/pass.vert";
import fsSim from "shaders/sim.frag";

import Config from "./Config";

import fsSave from "shaders/save.frag";

let hasSaved = false;
let canSave = false;

const num = 100;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this._seed = random(10000);
    this.resize();
  }

  _initTextures() {
    const numOfTargets = 4;
    this._fbo = new FboPingPong(
      num,
      num,
      {
        type: GL.FLOAT,
        minFilter: GL.NEAREST,
        magFilter: GL.NEAREST,
      },
      numOfTargets
    );
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const drawSave = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(vsPass, fsSave);

    this._fbo.write.bind();
    GL.clear(0, 0, 0, 0);
    drawSave.uniform("uSeed", random(1000)).draw();
    this._fbo.write.unbind();
    this._fbo.swap();

    const s = 0.02;
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
    mesh.bufferInstance(uv, "aUV").bufferInstance(extra, "aExtra");
    this._drawCubes = new Draw().setMesh(mesh).useProgram(vs, fs);

    this._drawSim = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(vsPass, fsSim)
      .setClearColor(0, 0, 0, 1);
  }

  update() {
    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .bindTexture("uVelMap", this._fbo.read.getTexture(1), 1)
      .bindTexture("uExtraMap", this._fbo.read.getTexture(2), 2)
      .bindTexture("uPosOrgMap", this._fbo.read.getTexture(3), 3)
      .uniform("uTime", Scheduler.getElapsedTime() + this._seed)
      .draw();
    this._fbo.swap();
  }

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);

    this._dAxis.draw();
    this._drawCubes.bindTexture("uPosMap", this._fbo.read.texture, 0).draw();

    g = 200;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(0));
    GL.viewport(g, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(1));
    GL.viewport(g * 2, 0, g, g);
    this._dCopy.draw(this._fbo.read.getTexture(1));

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
