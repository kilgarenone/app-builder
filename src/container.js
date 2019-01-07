import {
  snapElementToGridFromPixelDimension,
  snapToGridLine,
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists,
  nestGridLines,
  getXYRelativeToParent
} from "./utilities";
import { gridBoxSize, snapMouseXY } from "./mouse";
import createDragGrip from "./dragGrip";
import createResizerGrip from "./resizerGrip";
import createTextNode from "./text";

let container;
let snapX;
let snapY;
let relativeSnapX;
let relativeSnapY;
let parent;
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
  parent = getLastParentOrCanvasIfNoneExists(parents);

  if (parents.length) {
    const { relativeX, relativeY } = getXYRelativeToParent(parent, {
      x: snapX,
      y: snapY
    });
    relativeSnapX = relativeX;
    relativeSnapY = relativeY;
    nestGridLines(parent, gridBoxSize);
  }
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
  relativeSnapX = x;
  relativeSnapY = y;

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
    parent.appendChild(container);
    isAppended = true;
  }
  const snapToGridX = snapToGridLine(e.pageX, gridBoxSize) - snapX;
  const snapToGridY = snapToGridLine(e.pageY, gridBoxSize) - snapY;

  container.style.width = `${
    snapToGridX < gridBoxSize ? gridBoxSize : snapToGridX
  }px`;
  container.style.height = `${
    snapToGridY < gridBoxSize ? gridBoxSize : snapToGridY
  }px`;
  container.style.left = `${relativeSnapX}px`;
  container.style.top = `${relativeSnapY}px`;
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
