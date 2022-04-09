import {
  GL,
  Mesh,
  Draw,
  GLShader,
  DrawBall,
  DrawAxis,
  DrawCopy,
  Scene,
} from "alfrid";
import resize from "./utils/resize";
import { getColorTheme } from "./utils/ColorTheme";
import { random, getRandomElement, saveImage, getDateString } from "./utils";
import Color from "./utils/Color";

import Config from "./Config";

import vs from "shaders/strokes.vert";
import fs from "shaders/strokes.frag";

import vs2 from "shaders/test.vert";
import fs2 from "shaders/test2.frag";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // 3d perspective camera
    this.camera;
    this.orbitalControl.radius.value = 20;

    // 2d orthogonal camera
    this.cameraUI;
    this.resize();

    setTimeout(() => {
      canSave = true;
    }, 500);

    this.time = random(1000);
  }

  _initTextures() {}

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();

    const colorTheme = getColorTheme();
    console.log(colorTheme);

    let colorUniform = [];
    colorTheme.forEach((c) => {
      colorUniform.push(c[0], c[1], c[2]);
    });
    colorUniform = colorUniform.map((v) => v / 255);

    const s = 0.02;
    const w = 15 * s;
    const h = 1 * s;
    const positions = [];
    const positionOffsets = [];
    const colors = [];
    const randoms = [];
    const indices = [];
    let count = 0;

    const { num } = Config;
    const r = 10;

    for (let j = 0; j < num; j++) {
      for (let i = 0; i < num; i++) {
        positions.push([-w, -h, 0]);
        positions.push([w, -h, 0]);
        positions.push([w, h, 0]);
        positions.push([-w, h, 0]);

        // position offsets
        const t = 0.1;
        const start = (-t * num) / 2;
        const center = [i * t + start, j * t + start, 0];
        positionOffsets.push(center);
        positionOffsets.push(center);
        positionOffsets.push(center);
        positionOffsets.push(center);

        const rnd = [random(), random(), random()];
        randoms.push(rnd);
        randoms.push(rnd);
        randoms.push(rnd);
        randoms.push(rnd);

        indices.push(count * 4 + 0);
        indices.push(count * 4 + 1);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 0);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 3);

        count++;
      }
    }

    const mesh = new Mesh()
      .bufferVertex(positions)
      .bufferData(positionOffsets, "aPositionOffset")
      .bufferData(randoms, "aRandom")
      .bufferIndex(indices);
    const shader = new GLShader(vs, fs);

    this._drawStrokes = new Draw()
      .setMesh(mesh)
      .useProgram(shader)
      .uniform("uColors", "vec3", colorUniform)
      .uniform("uSeedColor", random(100));
  }

  update() {}

  render() {
    this.time += 0.01;
    let g = 0;
    GL.clear(g, g, g, 1);

    GL.setMatrices(this.camera);

    // this.renderere.render(mesh, camera);

    // this._dAxis.draw();
    this._drawStrokes.uniform("uTime", this.time).draw();

    GL.disable(GL.DEPTH_TEST);
    GL.setMatrices(this.cameraUI);

    // draw ui

    GL.enable(GL.DEPTH_TEST);
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
