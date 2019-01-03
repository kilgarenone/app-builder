import { gridBoxSize, setMousePosition } from "./mouse";
import {
  getFirstParentContainer,
  normalizeTransformToGrid,
  snapToGridLine,
  snapElementToGridFromDragging
} from "./utilities";

let container;
let dragGrip;
let startX;
let startY;

function handleMouseDown(e) {
  console.log("Clicked drag anchor ");
  container = getFirstParentContainer(e.target, "rectangle");
  dragGrip = e.target;
  const { x, y } = setMousePosition(e);
  startX = x;
  startY = y;
  dragGrip.style.opacity = 1;
  container.style.pointerEvents = "none";
  for (let i = 0; i < container.childNodes.length; i++) {
    container.childNodes[i].style.pointerEvents = "none";
  }
  document.body.style.cursor = "move";
  document.body.addEventListener("mousemove", handleContainerDragging, false);
  document.body.addEventListener("mouseup", handleMouseUp, false);
}

function handleMouseUp(e) {
  console.log("drag grip mouseup", e);
  // minus 7.5 to account for mouse offset from the drag-grip area during mouseup
  snapElementToGridFromDragging(
    e.pageX - 7.5,
    e.pageY - 7.5,
    container,
    gridBoxSize
  );
  document.body.style.cursor = "default";
  // normalizeTransformToGrid(container, gridBoxSize);
  document.body.removeEventListener("mouseup", handleMouseUp, false);
  document.body.removeEventListener(
    "mousemove",
    handleContainerDragging,
    false
  );

  // removes pointer-events's none value
  container.style.pointerEvents = "";
  for (let i = 0; i < container.childNodes.length; i++) {
    container.childNodes[i].style.pointerEvents = "";
  }

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
