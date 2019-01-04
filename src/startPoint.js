import {
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists
} from "./utilities";
import prepareContainerCreationProcess from "./container";
import { snapMouseXY } from "./mouse";
import { createTextNode } from "./text";

let container;
let paragraphContainer;
let snapX;
let snapY;
export let startPointEle;

export function initStartPoint() {
  startPointEle = document.getElementById("startPoint");
  // document.body.addEventListener(
  //   "mousemove",
  //   handleStartPointOnMouseMove,
  //   false
  // );
  prepareContainerCreationProcess();

  // startPointEle.addEventListener(
  //   "mousedown",
  //   handleMousedownOnStartPoint,
  //   false
  // );
}

function handleStartPointOnMouseMove(e) {
  startPointEle.style.opacity = 1;
  const { x, y } = snapMouseXY(e);
  snapX = x;
  snapY = y;
  startPointEle.style.transform = `translate(${snapX - 10}px, ${snapY - 10}px)`;
}

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

function handleMousedownOnStartPoint(e) {
  console.log("mouse down on start point", e);
  document.body.addEventListener("mouseup", handleMouseUpOnStartPoint, false);
  const parents = getAllParentContainers(e.target, "rectangle");
  console.log("parentCotnainer", parents);
  const parentContainer = getLastParentOrCanvasIfNoneExists(parents);
  startPointEle.style.opacity = 0;
  document.body.style.cursor = "crosshair";
  // container = createContainer(e, parentContainer);
}
