import { positionStartPoint, initStartPoint } from "./startPoint";
import { setGridBoxSize } from "./mouse";
import { createTextNode } from "./text";

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  initStartPoint();
  setGridBoxSize(gridBoxSize);

  /* Distinguish single click or double click */
  canvas.onclick = e => {
    if (e.detail === 2) {
      /* it was a double click */
      console.log("double click");
      positionStartPoint(e);
    }
  };
}
