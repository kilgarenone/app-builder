import {
  destroyContainer,
  snapElementToGrid,
  snapToGridLine
} from "./utilities";
import { snapY, snapX } from "./mouse";
import DragGrip from "./DragGrip";

const gridBoxSize = 32;

class Container {
  constructor(e, parentContainer) {
    this.init(parentContainer);
  }

  init(parentContainer) {
    /* Creating div container on first click on anywhere in canvas */
    console.log("div container creation begun.", parentContainer);

    this.element = document.createElement("div");
    this.element.className = "rectangle";
    this.element.style.position = "absolute";
    // element.style.left = e.pageX + "px";
    // element.style.top = e.pageY + "px";
    document.addEventListener(
      "mousemove",
      this.handleContainerShapeSizing,
      false
    );
    // document.addEventListener("mouseup", handleMouseUpOnStartPoint, false);

    parentContainer.appendChild(this.element);
  }

  // TODO: optimizes with requestAnimationFrame API
  handleContainerShapeSizing = e => {
    // if cursor is still moving inside the start point region,
    // don't create the container yet
    if (Math.abs(e.pageX - snapX) <= 10 || Math.abs(e.pageY - snapY) <= 10) {
      return;
    }

    // if mouse meant to create cont hasn't moved since clicked
    // on start point, then remove the cont
    const snapToGridX = snapToGridLine(e.pageX, gridBoxSize);
    const snapToGridY = snapToGridLine(e.pageY, gridBoxSize);

    this.element.style.width = `${Math.abs(snapToGridX - snapX)}px`;
    this.element.style.height = `${Math.abs(snapToGridY - snapY)}px`;
    this.element.style.left =
      e.pageX - snapX < 0 ? `${snapToGridX}px` : `${snapX}px`;
    this.element.style.top =
      e.pageY - snapY < 0 ? `${snapToGridY}px` : `${snapY}px`;
  };

  completeCreation() {
    document.removeEventListener(
      "mousemove",
      this.handleContainerShapeSizing,
      false
    );
    const dragGrip = new DragGrip(this.element).render();
    this.element.appendChild(dragGrip);
    // createResizer(element);
    snapElementToGrid(this.element, gridBoxSize);
    // destroyContainer(currentParagraphId);
    document.body.style.cursor = "default";
    console.log("div container creation finsihed.");
  }
  remove() {
    this.element.remove();
  }
}

export default Container;
