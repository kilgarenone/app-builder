import { calcSnappedToXY } from "./utilities";
export let snapX;
export let snapY;
export function setMousePosition(e) {
  return {
    startX: e.pageX + window.pageXOffset,
    startY: e.pageY + window.pageYOffset
  };
}

export function startAndSnapXY(e) {
  const { startX, startY } = setMousePosition(e);
  const { snappedX, snappedY } = calcSnappedToXY(startX, startY);
  snapX = snappedX;
  snapY = snappedY;
  console.log(snapX, snapY);
}
