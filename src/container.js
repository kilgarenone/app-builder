import {
  snapElementToGridFromPixelDimension,
  snapToGridLine,
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists
} from "./utilities";
import { gridBoxSize, snapMouseXY } from "./mouse";
import createDragGrip from "./dragGrip";
import createResizerGrip from "./resizerGrip";
import createTextNode from "./text";

let container;
let snapX;
let snapY;
let parentContainer;
let isAppended = false;
let reallyCreateContainerTimeout = null;
let observer;

export default function prepareContainerCreationProcess(observerFn) {
  observer = observerFn;
  document.body.addEventListener("mousedown", handleContainerCreation, false);
  document.body.addEventListener("click", handleTextCreation, false);
}

function handleTextCreation(e) {
  if (reallyCreateContainerTimeout) {
    clearTimeout(reallyCreateContainerTimeout);
    reallyCreateContainerTimeout = null;
  }

  if (e.target.className === "rectangle") {
    observer(e);
  }

  if (e.detail === 2) {
    createTextNode(e);
  }
}

function initContainerCreationProcess(e) {
  console.log("initContainerCreationProcess");
  const parents = getAllParentContainers(e.target, "rectangle");
  parentContainer = getLastParentOrCanvasIfNoneExists(parents);

  container = document.createElement("div");
  container.className = "rectangle";
  container.style.position = "absolute";

  document.body.style.cursor = "crosshair";

  document.body.addEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );
  document.body.addEventListener("mouseup", handleContainerOnMouseUp, false);
}

export function handleContainerCreation(e) {
  console.log("handleContainerCreation", e);
  isAppended = false;
  const { x, y } = snapMouseXY(e);
  snapX = x;
  snapY = y;

  // TODO: revisit this implementation
  reallyCreateContainerTimeout = setTimeout(
    () => initContainerCreationProcess.call(null, e),
    200
  );
}

// TODO: optimizes with requestAnimationFrame API
export function handleContainerShapeSizing(e) {
  // if cursor is still moving inside the start point region,
  // don't create the container yet
  if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
    return;
  }
  if (!isAppended) {
    parentContainer.appendChild(container);
    isAppended = true;
  }
  const snapToGridX = snapToGridLine(e.pageX, gridBoxSize);
  const snapToGridY = snapToGridLine(e.pageY, gridBoxSize);

  container.style.width = `${Math.abs(snapToGridX - snapX)}px`;
  container.style.height = `${Math.abs(snapToGridY - snapY)}px`;
  container.style.left =
    e.pageX - snapX < 0 ? `${snapToGridX}px` : `${snapX}px`;
  container.style.top = e.pageY - snapY < 0 ? `${snapToGridY}px` : `${snapY}px`;
}

export function handleContainerOnMouseUp(e) {
  document.body.removeEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );
  document.body.removeEventListener("mouseup", handleContainerOnMouseUp, false);

  // if cursor is still moving inside the start point region,
  // don't create the container yet
  if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
    return;
  }

  createDragGrip(container);
  createResizerGrip(container);
  snapElementToGridFromPixelDimension(container, gridBoxSize);
  document.body.style.cursor = "default";
}
