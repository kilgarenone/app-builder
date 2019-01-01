import { getFirstParentContainer } from "./utilities";
import { positionStartPoint, initStartPoint } from "./StartPoint";
import { startAndSnapXY, setGridBoxSize } from "./mouse";
import { createTextNode } from "./Text";

function getPixelDimensionFromGridArea(element, gridBoxSize) {
  const gridAreaInPixel = element.style.gridArea
    .match(/-?\d+/g)
    .map(grid => (grid - 1) * gridBoxSize);
  const elementObj = {};

  elementObj.height = gridAreaInPixel[2] - gridAreaInPixel[0];
  elementObj.width = gridAreaInPixel[3] - gridAreaInPixel[1];
  elementObj.left = gridAreaInPixel[1];
  elementObj.top = gridAreaInPixel[0];

  return elementObj;
}

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  let isCreatingContainer = false;
  let currentContainerId;
  let currentParagraphId;
  let isDragAnchorClicked = false;
  let element = null;
  let snappedX = 0;
  let snappedY = 0;

  let startPoint;

  initStartPoint();
  setGridBoxSize(gridBoxSize);
  // function createResizer(element) {
  //   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  //   const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  //   svg.setAttribute("class", "resizer-grip");
  //   svg.setAttribute("width", "24");
  //   svg.setAttribute("height", "24");
  //   svg.setAttribute("viewBox", "0 0 24 24");
  //   svg.addEventListener("mousedown", initResizing, false);

  //   path.setAttribute(
  //     "d",
  //     "M17.303 20.132l2.829-2.829-1.414-1.414-2.829 2.829zM3.868 16.596l1.414 1.414L18.01 5.282l-1.414-1.414zm7.071 2.829l8.486-8.486-1.415-1.414-8.485 8.485z"
  //   );
  //   path.setAttribute("fill", "grey");

  //   svg.appendChild(path);

  //   element.appendChild(svg);
  // }

  // function initResizing(e) {
  //   console.log("resiz", e);
  //   //
  //   element = e.target.classList.contains("resizer-grip")
  //     ? e.target.parentNode
  //     : e.target.parentNode.parentNode;

  //   const dimension = getPixelDimensionFromGridArea(element, gridBoxSize);
  //   console.log(dimension);

  //   canvas.style.cursor = "nwse-resize";

  //   element.style.position = "absolute";
  //   element.style.width = `${dimension.width}px`;
  //   element.style.height = `${dimension.height}px`;
  //   element.style.top = `${dimension.top}px`;
  //   element.style.left = `${dimension.left}px`;

  //   calcSnappedToXY({
  //     customX: dimension.left,
  //     customY: dimension.top
  //   });

  //   canvas.addEventListener("mousemove", handleContainerShapeSizing, false);
  //   canvas.addEventListener("mouseup", handleStopResizing, false);
  // }

  // function handleStopResizing(e) {
  //   snapElementToGrid(element, gridBoxSize);
  //   canvas.style.cursor = "default";
  //   canvas.removeEventListener("mousemove", handleContainerShapeSizing, false);
  //   canvas.removeEventListener("mouseup", handleStopResizing, false);
  //   element = null;
  // }

  // TODO: refactor to dynamic add & remove mouseup event listener
  // canvas.onmouseup = e => {
  //   if (isDragAnchorClicked) {
  //     isDragAnchorClicked = false;
  //     canvas.style.cursor = "default";
  //     normalizeTransformToGrid(element, gridBoxSize);
  //     canvas.removeEventListener("mousemove", handleContainerDragging, false);
  //     setTimeout(() => (e.target.style.opacity = ""), 0);
  //   }
  // };

  /* Distinguish single click or double click */
  canvas.onclick = e => {
    if (e.detail === 2) {
      /* it was a double click */
      console.log("double click");
      startAndSnapXY(e);
      positionStartPoint(e);
      createTextNode(e.target);
    }
  };

  // TODO: consider move this to individual event listener in respective element
  canvas.onmousedown = e => {
    //   } else if (e.target.className === "paragraph") {
    //     e.target.setAttribute("spellcheck", true);
    //   }
  };
}
