import {
  getFirstParentContainer,
  getPixelDimensionFromGridArea,
  snapElementToGrid,
  snapToGridLine,
  getAllParentContainers,
  getXYRelativeToParent
} from "./utilities";
import { gridBoxSize, snapToXY, snapToCustomXY } from "./mouse";

let container;
let dragGripEle;
let snapX;
let snapY;

export default function createResizerGrip(element) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("class", "resizer-grip");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");

  svg.addEventListener("mousedown", initResizing, false);

  path.setAttribute(
    "d",
    "M17.303 20.132l2.829-2.829-1.414-1.414-2.829 2.829zM3.868 16.596l1.414 1.414L18.01 5.282l-1.414-1.414zm7.071 2.829l8.486-8.486-1.415-1.414-8.485 8.485z"
  );
  path.setAttribute("fill", "grey");

  svg.appendChild(path);

  element.appendChild(svg);
}

function initResizing(e) {
  const parentContainers = getFirstParentContainer(e.target, "rectangle");
  console.log("allparents", parentContainers);
  container = parentContainers;
  dragGripEle = container.querySelector(".drag-grip");
  dragGripEle.style.opacity = "0";

  const dimension = getPixelDimensionFromGridArea(container, gridBoxSize);
  console.log("dimension", dimension);

  document.body.style.cursor = "nwse-resize";

  container.style.position = "absolute";
  container.style.width = `${dimension.width}px`;
  container.style.height = `${dimension.height}px`;
  container.style.top = `${dimension.top}px`;
  container.style.left = `${dimension.left}px`;

  snapX = dimension.left;
  snapY = dimension.top;

  document.body.addEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );
  document.body.addEventListener("mouseup", handleStopResizing, false);
}

function handleContainerShapeSizing(e) {
  const snapToGridX = snapToGridLine(e.pageX, gridBoxSize);
  const snapToGridY = snapToGridLine(e.pageY, gridBoxSize);

  container.style.width = `${Math.abs(snapToGridX - snapX)}px`;
  container.style.height = `${Math.abs(snapToGridY - snapY)}px`;
  container.style.left =
    e.pageX - snapX < 0 ? `${snapToGridX}px` : `${snapX}px`;
  container.style.top = e.pageY - snapY < 0 ? `${snapToGridY}px` : `${snapY}px`;
}

function handleStopResizing(e) {
  document.body.style.cursor = "default";
  dragGripEle.style.opacity = "";
  snapElementToGrid(container, gridBoxSize);
  document.body.removeEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );
  document.body.removeEventListener("mouseup", handleStopResizing, false);
}
