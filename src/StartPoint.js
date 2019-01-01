import { getFirstParentContainer } from "./utilities";
import createContainer, { completeContainerCreation } from "./Container";
import { snapY, snapX } from "./mouse";

let container;
export let startPointEle;

export function initStartPoint() {
  startPointEle = document.getElementById("startPoint");
  // positionStartPoint();
  startPointEle.addEventListener(
    "mousedown",
    handleMousedownOnStartPoint,
    false
  );
}

export function positionStartPoint(e) {
  // destroyContainer(currentContainerId);
  startPointEle.style.transform = `translate(${snapX - 10}px, ${snapY - 10}px)`;
  startPointEle.style.opacity = 1;
}

function handleMouseUpOnStartPoint(e) {
  console.log(e);
  // if cursor is still moving inside the start point region,
  // don't create the container yet
  // isCreatingContainer = false;
  if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
    startPointEle.style.opacity = 1;
    document.body.style.cursor = "default";
    container.remove();
    return;
  }
  document.removeEventListener("mouseup", handleMouseUpOnStartPoint, false);

  // startPointEle.removeEventListener(
  //   "mouseup",
  //   handleMouseUpOnStartPoint,
  //   false
  // );
  // startPointEle.removeEventListener(
  //   "mousedown",
  //   handleMousedownOnStartPoint,
  //   false
  // );
  completeContainerCreation(container);
}

function handleMousedownOnStartPoint(e) {
  document.addEventListener("mouseup", handleMouseUpOnStartPoint, false);
  const parentContainer = getFirstParentContainer(e.target, "rectangle");
  console.log("Parent container", parentContainer);
  startPointEle.style.opacity = 0;
  document.body.style.cursor = "crosshair";
  container = createContainer(parentContainer);
}
