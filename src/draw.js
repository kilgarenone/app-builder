import { getFirstParentContainer } from "./utilities";
import { positionStartPoint, initStartPoint } from "./startPoint";
import { startAndSnapXY, setGridBoxSize } from "./mouse";
import { createTextNode } from "./text";

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  initStartPoint();
  setGridBoxSize(gridBoxSize);

  /* Distinguish single click or double click */
  canvas.onclick = e => {
    if (e.detail === 2) {
      console.log(e);
      /* it was a double click */
      console.log("double click");
      startAndSnapXY(e);
      positionStartPoint(e);
      createTextNode(e.target);
    }
  };
}
