import { CEIL, gridBoxSize, snapMouseXY } from "./mouse";
import {
  getFirstParentContainer,
  snapElementToGridFromPixelDimension,
  nestGridLines,
  getXYRelativeToParent,
  getAllParentContainers,
  getLastParentOrCanvasIfNoneExists
} from "./utilities";
import { startPointEle } from "./startPoint";
import createDragGrip from "./dragGrip";
import createResizerGrip from "./resizerGrip";

let container = null;
let snapX;
let snapY;

export function createTextNode(e) {
  // user has moved on to new start point, so removes
  // last text node that was unutilized
  // if (container) {
  //   container.remove();
  // }

  const { x, y } = snapMouseXY(e);
  snapX = x;
  snapY = y;

  const parents = getAllParentContainers(e.target, "rectangle");
  const parent = getLastParentOrCanvasIfNoneExists(parents);
  if (parents.length) {
    const { relativeX, relativeY } = getXYRelativeToParent(parent, {
      x: snapX,
      y: snapY
    });
    snapX = relativeX;
    snapY = relativeY;
    nestGridLines(parent, gridBoxSize);
  }
  container = document.createElement("div");
  container.className = "rectangle";
  container.style.position = "absolute";
  container.style.left = `${snapX}px`;
  container.style.top = `${snapY}px`;

  const paragraph = document.createElement("p");
  paragraph.className = "paragraph";
  paragraph.contentEditable = true;
  paragraph.style.transform = "scale(0, 0)";
  paragraph.oninput = () => {
    paragraph.style.transform = "scale(1, 1)";
    startPointEle.style.opacity = 0;
    paragraph.oninput = null;
  };
  paragraph.onblur = completeTextNodeCreation;

  container.appendChild(paragraph);

  parent.appendChild(container);

  paragraph.focus();

  return container;
}

function completeTextNodeCreation(e) {
  if (!e.target.textContent) {
    // refocus previous paragraph if user single clicks elsewhere
    // while the startpoint is active
    // TODO: find way to avoid having to re-focus cuz focus() is layout thrashing
    setTimeout(() => e.target.focus(), 0);
    return;
  }
  // get rid of that red curly underline under texts
  e.target.setAttribute("spellcheck", false);
  createDragGrip(e.target.parentNode);

  createResizerGrip(e.target.parentNode);

  snapElementToGridFromPixelDimension(e.target.parentNode, gridBoxSize, {
    snapBehaviour: CEIL
  });
  e.target.onblur = e => e.target.setAttribute("spellcheck", false);
  // don't remove this well formed text node on next new
  // start point
  // container = null;
}
