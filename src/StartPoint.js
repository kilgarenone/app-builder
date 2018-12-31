import { getFirstParentContainer } from "./utilities";
import Container from "./Container";
import { snapY, snapX } from "./mouse";

let startPointEle;
let container;

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
  document.addEventListener("mouseup", handleMouseUpOnStartPoint, false);
  startPointEle.style.transform = `translate(${snapX - 10}px, ${snapY - 10}px)`;
  startPointEle.style.opacity = 1;
}

function handleMouseUpOnStartPoint(e) {
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
  container.completeCreation();
}

function handleMousedownOnStartPoint(e) {
  const parentContainer = getFirstParentContainer(e.target, "rectangle");
  console.log("Parent container", parentContainer);
  startPointEle.style.opacity = 0;
  document.body.style.cursor = "crosshair";
  container = new Container(e, parentContainer);
}
