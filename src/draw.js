import { getFirstParentContainer } from "./utilities";
import StartPoint from "./StartPoint";
import { startAndSnapXY } from "./mouse";

const CEIL = "ceil";
const ROUND = "round";

function createDragAnchorElement(element) {
  const dragAnchor = document.createElement("span");
  dragAnchor.className = "drag-anchor";
  element.appendChild(dragAnchor);
}

function getXYFromTransform(element) {
  return element.style.transform.match(/-?\d+/g);
}

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

// function normalizeTransformToGrid(element, gridBoxSize) {
//   const offset = getXYFromTransform(element);
//   // might mean double clicked the drag square box without mousemove,
//   // therefore, no transform data is set. if yes, don't access offset
//   // array, otherwise error will be thrown
//   if (!offset) {
//     return;
//   }
//   const offsetGridBoxesX = roundPixelToGridBoxes(offset[0], gridBoxSize);
//   const offsetGridBoxesY = roundPixelToGridBoxes(offset[1], gridBoxSize);

//   element.style.gridRowStart = +element.style.gridRowStart + offsetGridBoxesY;
//   element.style.gridColumnStart =
//     +element.style.gridColumnStart + offsetGridBoxesX;
//   element.style.gridRowEnd = +element.style.gridRowEnd + offsetGridBoxesY;
//   element.style.gridColumnEnd = +element.style.gridColumnEnd + offsetGridBoxesX;

//   element.style.transform = "";
//   element = null;
// }

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

  // function initTextNodeCreation(e) {
  //   // TODO: Create granular gridboxes when user is
  //   // creating a rectangle inside another rectangle!
  //   console.log("creating text node", e);
  //   destroyContainer(currentParagraphId);
  //   const container = document.createElement("div");
  //   currentParagraphId = Math.random();
  //   container.id = currentParagraphId;
  //   container.className = "rectangle";
  //   container.style.position = "absolute";
  //   container.style.left = `${snappedX}px`;
  //   container.style.top = `${snappedY}px`;

  //   const paragraph = document.createElement("p");
  //   paragraph.className = "paragraph";
  //   paragraph.contentEditable = true;
  //   paragraph.style.transform = "scale(0, 0)";
  //   paragraph.oninput = () => {
  //     paragraph.style.transform = "scale(1, 1)";
  //     startPointEle.style.opacity = 0;
  //     destroyContainer(currentContainerId);
  //     paragraph.oninput = null;
  //   };
  //   paragraph.onblur = completeTextNodeCreation;
  //   container.appendChild(paragraph);
  //   e.target.appendChild(container);
  //   paragraph.focus();
  // }

  // function completeTextNodeCreation(e) {
  //   if (!e.target.textContent) {
  //     // refocus previous paragraph if user single clicks elsewhere
  //     // while the startpoint is active
  //     // TODO: find way to avoid having to re-focus cuz focus() is layout thrashing
  //     setTimeout(() => e.target.focus(), 0);
  //     return;
  //   }
  //   // get rid of that red curly underline under texts
  //   e.target.setAttribute("spellcheck", false);
  //   e.target.parentNode.removeAttribute("id");
  //   createDragAnchorElement(e.target.parentNode);
  //   createResizer(e.target.parentNode);

  //   snapElementToGrid(e.target.parentNode, gridBoxSize, {
  //     snapBehaviour: CEIL
  //   });

  //   e.target.onblur = e => e.target.setAttribute("spellcheck", false);
  // }

  // function handleContainerDragging(e) {
  //   const x = snapToGridLine(e.pageX - mouse.startX, gridBoxSize);
  //   const y = snapToGridLine(e.pageY - mouse.startY, gridBoxSize);
  //   element.style.transform = `translate(${x}px, ${y}px)`;
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
      if (startPoint) {
        startPoint.positionIt(e);
      } else {
        startPoint = new StartPoint(e);
      }
      // initTextNodeCreation(e);
    }
  };

  // TODO: consider move this to individual event listener in respective element
  canvas.onmousedown = e => {
    //   console.log("onmousedown", e);
    //   if (e.target.className === "drag-anchor") {
    //     console.log("Clicked drag anchor ");
    //     isDragAnchorClicked = true;
    //     setMousePosition(e);
    //     e.target.style.opacity = 1;
    //     canvas.style.cursor = "move";
    //     canvas.addEventListener("mousemove", handleContainerDragging, false);
    //     // prevents after onmouseup, the click event won't
    //     // bubble up to the canvas's onclick handler
    //     // e.target.onclick = e => e.stopPropagation();
    //     // set its div 'rectangle' cont as element
    //     element = e.target.parentNode;
    //   } else if (e.target.className === "paragraph") {
    //     e.target.setAttribute("spellcheck", true);
    //   }
  };
}
