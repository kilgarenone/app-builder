import {
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists
} from "./utilities";
import { snapMouseXY } from "./mouse";
import createTextNode from "./text";

let container;
let paragraphContainer;
let snapX;
let snapY;
export let startPointEle;

export function positionStartPoint(e) {
  paragraphContainer = createTextNode(e);
  startPointEle.style.opacity = 1;
}

function handleMouseUpOnStartPoint(e) {
  // if cursor is still moving inside the start point region,
  // don't create the container yet
  if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
    startPointEle.style.opacity = 1;
    document.body.style.cursor = "default";
    container.remove();
    return;
  }

  document.body.removeEventListener(
    "mouseup",
    handleMouseUpOnStartPoint,
    false
  );

  if (!paragraphContainer.textContent) {
    paragraphContainer.remove();
  }
  // completeContainerCreation(container);
}
