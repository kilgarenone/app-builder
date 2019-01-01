import { snapToGridLine } from "./utilities";

export function setMousePosition(e) {
  return {
    x: e.pageX + window.pageXOffset,
    y: e.pageY + window.pageYOffset
  };
}

export function calcSnappedToXY(e) {
  const x = snapToGridLine(e.pageX + window.pageXOffset, gridBoxSize, {
    force: true
  });

  const y = snapToGridLine(e.pageY + window.pageYOffset, gridBoxSize, {
    force: true
  });

  return { x, y };
}

export let gridBoxSize;
export const CEIL = "ceil";
export const ROUND = "round";

export function setGridBoxSize(size) {
  console.log("grid box size", size);
  gridBoxSize = size;
}
