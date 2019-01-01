import { calcSnappedToXY } from "./utilities";
export let snapX;
export let snapY;
export let startX;
export let startY;
export function setMousePosition(e) {
  startX = e.pageX + window.pageXOffset;
  startY = e.pageY + window.pageYOffset;
}

export function startAndSnapXY(e) {
  setMousePosition(e);
  const { snappedX, snappedY } = calcSnappedToXY(startX, startY);
  snapX = snappedX;
  snapY = snappedY;
}

export let gridBoxSize;
export const CEIL = "ceil";
export const ROUND = "round";

export function setGridBoxSize(size) {
  gridBoxSize = size;
}
