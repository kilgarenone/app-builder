import { getFirstParentContainer } from "./utilities";
import Container from "./Container";
import { snapY, snapX } from "./mouse";
class StartPoint {
  constructor(e) {
    this.init();
  }

  init() {
    this.startPointEle = document.getElementById("startPoint");
    this.positionIt();
    this.startPointEle.addEventListener(
      "mousedown",
      this.handleMousedownOnStartPoint,
      false
    );

    this.startPointEle.addEventListener(
      "mouseup",
      this.handleMousedownOnStartPoint,
      false
    );
  }

  positionIt(e) {
    // destroyContainer(currentContainerId);
    this.startPointEle.style.transform = `translate(${snapX - 10}px, ${snapY -
      10}px)`;
    this.startPointEle.style.opacity = 1;
  }

  handleMouseUpOnStartPoint(e) {
    // if cursor is still moving inside the start point region,
    // don't create the container yet
    // isCreatingContainer = false;
    if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
      this.startPointEle.style.opacity = 1;
      document.style.cursor = "default";
      this.container.remove();
      return;
    }
    this.container.completeCreation();
  }

  handleMousedownOnStartPoint(e) {
    const parentContainer = getFirstParentContainer(e.target, "rectangle");
    console.log("Parent container", parentContainer);
    this.startPointEle.style.opacity = 0;
    document.style.cursor = "crosshair";
    this.container = new Container(e, parentContainer);
  }
}

export default StartPoint;
