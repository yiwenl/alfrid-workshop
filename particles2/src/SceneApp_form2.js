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
import fsSim from "shaders/sim_form2.frag";

import Config from "./Config";

import fsSave from "shaders/save_form2.frag";

let hasSaved = false;
let canSave = false;

const num = 600;

class SceneApp extends Scene {
  constructor() {
    super();

    // this.orbitalControl.lock();
    this._seed = random(10000);
    this.resize();
  }

  _initTextures() {
    this._texture = Assets.get("noise");
    this._texture.wrapS = GL.REPEAT;
    this._texture.wrapT = GL.REPEAT;
    this._texture.showProperties();

    const numOfTargets = 3;
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
      .bindTexture("noiseMap", this._texture, 0)
      .uniform("uTime", Scheduler.getElapsedTime() + this._seed)
      .useProgram(vsPass, fsSave);

    this._fbo.write.bind();
    GL.clear(0, 0, 0, 0);
    drawSave.uniform("uSeed", random()).draw();
    this._fbo.write.unbind();
    this._fbo.swap();

    const s = 0.013;
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
      .uniform("uSeed", random())
      .setClearColor(0, 0, 0, 1);
  }

  update() {
    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .bindTexture("uExtraMap", this._fbo.read.getTexture(1), 1)
      .bindTexture("uPosOrgMap", this._fbo.read.getTexture(2), 2)
      .bindTexture("noiseMap", this._texture, 3)
      .uniform("uTime", Scheduler.getElapsedTime() + this._seed)
      .draw();
    this._fbo.swap();
  }

  render() {
    let g = 0.8;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);

    //this._dAxis.draw();
    this._drawCubes.bindTexture("uPosMap", this._fbo.read.texture, 0).draw();

    g = 200;
    GL.viewport(0, 0, g, g);
    //this._dCopy.draw(this._fbo.read.getTexture(0));
    GL.viewport(g, 0, g, g);
    //this._dCopy.draw(this._fbo.read.getTexture(1));
    GL.viewport(g * 2, 0, g, g);
    //this._dCopy.draw(this._fbo.read.getTexture(2));

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
