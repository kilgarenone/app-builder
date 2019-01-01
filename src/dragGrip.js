import { setMousePosition, startX, startY, gridBoxSize } from "./mouse";
import {
  snapToGridLine,
  normalizeTransformToGrid,
  getFirstParentContainer
} from "./utilities";

let container;
let dragGrip;

function handleMouseDown(e) {
  console.log("Clicked drag anchor ");
  container = getFirstParentContainer(e.target, "rectangle");
  dragGrip = e.target;
  setMousePosition(e);
  dragGrip.style.opacity = 1;
  document.body.style.cursor = "move";
  document.body.addEventListener("mousemove", handleContainerDragging, false);
  document.body.addEventListener("mouseup", handleMouseUp, false);
}

function handleMouseUp(e) {
  console.log("mouseup", e);
  document.body.style.cursor = "default";
  normalizeTransformToGrid(container, gridBoxSize);
  document.body.removeEventListener("mouseup", handleMouseUp, false);
  document.body.removeEventListener(
    "mousemove",
    handleContainerDragging,
    false
  );

  dragGrip.style.opacity = "";
}

function handleContainerDragging(e) {
  const x = snapToGridLine(e.pageX - startX, gridBoxSize);
  const y = snapToGridLine(e.pageY - startY, gridBoxSize);
  container.style.transform = `translate(${x}px, ${y}px)`;
}

export default function createDragGrip(target) {
  const dragGrip = document.createElement("span");
  dragGrip.className = "drag-grip";
  dragGrip.addEventListener("mousedown", handleMouseDown, false);
  target.appendChild(dragGrip);
}
