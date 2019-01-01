import { gridBoxSize } from "./mouse";

export function getFirstParentContainer(element, className) {
  if (element.classList.contains("canvas")) {
    return element;
  }

  if (element.classList.contains(className)) {
    console.log("found element!", element); // returns correct element
    return element;
  } else {
    return getFirstParentContainer(element.parentNode, className);
  }
}

export function destroyContainer(id) {
  if (!id) {
    return;
  }

  const element = document.getElementById(id);

  if (element) {
    element.remove();
  }
}

export function calcSnappedToXY(x, y) {
  const snappedX = snapToGridLine(x, gridBoxSize, {
    force: true
  });

  const snappedY = snapToGridLine(y, gridBoxSize, {
    force: true
  });

  return { snappedX, snappedY };
}

export function snapToGridLine(val, gridBoxSize, { force } = { force: false }) {
  const snapCandidate = gridBoxSize * Math.round(val / gridBoxSize);

  if (force) {
    return snapCandidate;
  }

  if (Math.abs(val - snapCandidate) <= 10) {
    return snapCandidate;
  } else {
    return val;
  }
}

function roundPixelToGridBoxes(pixel, gridBoxSize, snapBehaviour = ROUND) {
  return Math[snapBehaviour](parseFloat(pixel) / gridBoxSize);
}

const CEIL = "ceil";
const ROUND = "round";

export function snapElementToGrid(
  element,
  gridBoxSize,
  { snapBehaviour } = { snapBehaviour: ROUND }
) {
  const top = roundPixelToGridBoxes(element.style.top, gridBoxSize);
  const left = roundPixelToGridBoxes(element.style.left, gridBoxSize);
  const width = roundPixelToGridBoxes(
    element.style.width || element.clientWidth,
    gridBoxSize
  );
  const height = roundPixelToGridBoxes(
    element.style.height || element.clientHeight,
    gridBoxSize
  );

  const gridColumnStart = left + 1;
  const gridColumnEnd = left + width + 1;
  const gridRowStart = top + 1;
  const gridRowEnd = top + height + 1;

  element.style.gridRowStart = gridRowStart;
  element.style.gridColumnStart = gridColumnStart;
  element.style.gridRowEnd = gridRowEnd;
  element.style.gridColumnEnd = gridColumnEnd;

  element.style.position = "relative";
  element.style.top = "";
  element.style.left = "";
  element.style.width = "";
  element.style.height = "";
}

function getXYFromTransform(element) {
  return element.style.transform.match(/-?\d+/g);
}

export function normalizeTransformToGrid(element, gridBoxSize) {
  const offset = getXYFromTransform(element);
  // might mean double clicked the drag square box without mousemove,
  // therefore, no transform data is set. if yes, don't access offset
  // array, otherwise error will be thrown
  if (!offset) {
    return;
  }
  const offsetGridBoxesX = roundPixelToGridBoxes(offset[0], gridBoxSize);
  const offsetGridBoxesY = roundPixelToGridBoxes(offset[1], gridBoxSize);

  element.style.gridRowStart = +element.style.gridRowStart + offsetGridBoxesY;
  element.style.gridColumnStart =
    +element.style.gridColumnStart + offsetGridBoxesX;
  element.style.gridRowEnd = +element.style.gridRowEnd + offsetGridBoxesY;
  element.style.gridColumnEnd = +element.style.gridColumnEnd + offsetGridBoxesX;

  element.style.transform = "";
}
