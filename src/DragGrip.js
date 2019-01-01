import { setMousePosition, startX, startY } from "./mouse";
import { snapToGridLine, normalizeTransformToGrid } from "./utilities";

const gridBoxSize = 32;

class DragGrip {
  constructor(container) {
    this.container = container;
  }

  handleMouseDown = e => {
    console.log("Clicked drag anchor ");
    setMousePosition(e);
    this.dragGrip.style.opacity = 1;
    document.body.style.cursor = "move";
    document.body.addEventListener(
      "mousemove",
      this.handleContainerDragging,
      false
    );
    document.body.addEventListener("mouseup", this.handleMouseUp, false);
    // prevents after onmouseup, the click event won't
    // bubble up to the canvas's onclick handler
    // e.target.onclick = e => e.stopPropagation();
    // set its div 'rectangle' cont as element
    // element = e.target.parentNode;
  };

  handleMouseUp = e => {
    console.log("mouseup", e);
    document.body.style.cursor = "default";
    normalizeTransformToGrid(this.container, gridBoxSize);
    document.body.removeEventListener("mouseup", this.handleMouseUp, false);
    document.body.removeEventListener(
      "mousemove",
      this.handleContainerDragging,
      false
    );
  };

  handleContainerDragging = e => {
    const x = snapToGridLine(e.pageX - startX, gridBoxSize);
    const y = snapToGridLine(e.pageY - startY, gridBoxSize);
    this.container.style.transform = `translate(${x}px, ${y}px)`;
  };

  render = () => {
    this.dragGrip = document.createElement("span");
    this.dragGrip.className = "drag-grip";
    this.dragGrip.addEventListener("mousedown", this.handleMouseDown, false);
    return this.dragGrip;
  };
}

export default DragGrip;
