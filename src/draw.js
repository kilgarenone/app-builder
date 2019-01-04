import { positionStartPoint, initStartPoint } from "./startPoint";
import { setGridBoxSize } from "./mouse";
import { createTextNode } from "./text";
import prepareContainerCreationProcess from "./container";

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  prepareContainerCreationProcess();
  setGridBoxSize(gridBoxSize);
}
