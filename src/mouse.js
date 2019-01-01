import { snapToGridLine } from "./utilities";

export let snapX;
export let snapY;
export let startX;
export let startY;

export function setMousePosition(e) {
  startX = e.pageX + window.pageXOffset;
  startY = e.pageY + window.pageYOffset;
}

export function calcSnappedToXY(x, y) {
  snapX = snapToGridLine(x, gridBoxSize, {
    force: true
  });

  snapY = snapToGridLine(y, gridBoxSize, {
    force: true
  });
}

export function startAndSnapXY(e) {
  setMousePosition(e);
  calcSnappedToXY(startX, startY);
}

export let gridBoxSize;
export const CEIL = "ceil";
export const ROUND = "round";

export function setGridBoxSize(size) {
  gridBoxSize = size;
}
