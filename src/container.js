import { snapElementToGrid, snapToGridLine } from "./utilities";
import { snapY, snapX, gridBoxSize } from "./mouse";
import createDragGrip from "./dragGrip";
import createResizerGrip from "./resizerGrip";

let container;
export default function createContainer(parentContainer) {
  console.log("div container creation begun.", parentContainer);

  container = document.createElement("div");
  container.className = "rectangle";
  container.style.position = "absolute";
  document.body.addEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );

  parentContainer.appendChild(container);

  return container;
}

// TODO: optimizes with requestAnimationFrame API
export function handleContainerShapeSizing(e) {
  // if cursor is still moving inside the start point region,
  // don't create the container yet
  if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
    return;
  }

  const snapToGridX = snapToGridLine(e.pageX, gridBoxSize);
  const snapToGridY = snapToGridLine(e.pageY, gridBoxSize);

  container.style.width = `${Math.abs(snapToGridX - snapX)}px`;
  container.style.height = `${Math.abs(snapToGridY - snapY)}px`;
  container.style.left =
    e.pageX - snapX < 0 ? `${snapToGridX}px` : `${snapX}px`;
  container.style.top = e.pageY - snapY < 0 ? `${snapToGridY}px` : `${snapY}px`;
}

export function completeContainerCreation(container) {
  document.body.removeEventListener(
    "mousemove",
    handleContainerShapeSizing,
    false
  );
  createDragGrip(container);
  createResizerGrip(container);
  snapElementToGrid(container, gridBoxSize);
  document.body.style.cursor = "default";
  console.log("div container creation finsihed.");
}
