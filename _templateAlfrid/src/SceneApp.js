import { GL, Geom, DrawBall, DrawAxis, DrawCopy, Scene } from "alfrid";
import Assets from "./Assets";
import resize from "./utils/resize";
import Scheduler from "scheduling";
import { getColorTheme } from "./utils/ColorTheme";
import { saveImage, getDateString } from "./utils";
import Color from "./utils/Color";

import vs from "shaders/basic.vert";
import fs from "shaders/diffuse.frag";
import Config from "./Config";

let hasSaved = false;
let canSave = false;

class SceneApp extends Scene {
  constructor() {
    super();

    this.colors = getColorTheme();
    this.color0 = new Color(this.colors[0]);
    this.color1 = new Color("#ff6600");
    this.color2 = new Color(255, 10, 10);
    this.orbitalControl.lock();

    console.log(this.colors.toString());
    this.resize();

    setTimeout(() => {
      gui.add(this.color0, "hue", 0, 360);
      gui.add(this.color0, "saturation", 0, 1);
      gui.add(this.color0, "lightness", 0, 1);
      canSave = true;
    }, 500);
  }

  _initTextures() {}

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dCopy = new DrawCopy();
    this._dBall = new DrawBall();
  }

  update() {}

  render() {
    let g = 0.1;
    GL.clear(g, g, g, 1);

    const color = this.colors[0];
    GL.clear(color[0], color[1], color[2], 1);

    GL.setMatrices(this.camera);

    const r = 1;
    this._dBall.draw([-r, 0, 0], [g, g, g], this.color0.glsl);
    this._dBall.draw([0, 0, 0], [g, g, g], this.color1.glsl);
    this._dBall.draw([r, 0, 0], [g, g, g], this.color2.glsl);

    this._dAxis.draw();

    g = 300;
    GL.viewport(0, 0, g, g);
    this._dCopy.draw(Assets.get("color"));

    if (canSave && !hasSaved && Config.autoSave) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }
  }

  resize() {
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window;
    const canvasScale = 2;
    let s = Math.max(canvasScale, devicePixelRatio);
    s = 2;
    const width = w;
    const height = h;
    resize(GL.canvas, width * s, height * s, GL);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
