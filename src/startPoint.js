import {
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists
} from "./utilities";
import createContainer, { completeContainerCreation } from "./container";
import { snapMouseXY } from "./mouse";
import { createTextNode } from "./text";

let container;
let paragraphContainer;
let snapX;
let snapY;
export let startPointEle;

export function initStartPoint() {
  startPointEle = document.getElementById("startPoint");
  startPointEle.addEventListener(
    "mousedown",
    handleMousedownOnStartPoint,
    false
  );
}

export function positionStartPoint(e) {
  const { x, y } = snapMouseXY(e);
  snapX = x;
  snapY = y;
  paragraphContainer = createTextNode(e);
  startPointEle.style.transform = `translate(${snapX - 10}px, ${snapY - 10}px)`;
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
  completeContainerCreation(container);
}

function handleMousedownOnStartPoint(e) {
  document.body.addEventListener("mouseup", handleMouseUpOnStartPoint, false);
  const parents = getAllParentContainers(e.target, "rectangle");
  const parentContainer = getLastParentOrCanvasIfNoneExists(parents);
  console.log("Parent container", parentContainer);
  startPointEle.style.opacity = 0;
  document.body.style.cursor = "crosshair";
  container = createContainer(e, parentContainer);
}
