import { setMousePosition, startX, startY, gridBoxSize } from "./mouse";
import { snapToGridLine, normalizeTransformToGrid } from "./utilities";

let container;
let dragGrip;

function handleMouseDown(e) {
  console.log("Clicked drag anchor ");
  setMousePosition(e);
  dragGrip.style.opacity = 1;
  document.body.style.cursor = "move";
  document.body.addEventListener("mousemove", handleContainerDragging, false);
  document.body.addEventListener("mouseup", handleMouseUp, false);
  // prevents after onmouseup, the click event won't
  // bubble up to the canvas's onclick handler
  // e.target.onclick = e => e.stopPropagation();
  // set its div 'rectangle' cont as element
  // element = e.target.parentNode;
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
  container = target;
  dragGrip = document.createElement("span");
  dragGrip.className = "drag-grip";
  dragGrip.addEventListener("mousedown", handleMouseDown, false);
  container.appendChild(dragGrip);
}
