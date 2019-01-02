import { gridBoxSize } from "./mouse";

export function getFirstParentContainer(element, className) {
  // search until element that has 'className'
  while (!element.classList.contains(className)) {
    element = element.parentElement;
  }
  return element;
}

export function getAllParentContainers(element, className) {
  const parents = [];
  // traverse upwards to get all elements that has 'className',
  while (element) {
    if (element.classList.contains(className)) {
      parents.push(element);
    }
    element = element.parentElement;
  }

  return parents;
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

export function snapElementToGrid(element, gridBoxSize) {
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

export function getDimensionInPixelFromGridArea(element, gridBoxSize) {
  const gridAreaInPixel = parseRowsColumnsFromGridArea(element).map(
    grid => (grid - 1) * gridBoxSize
  );
  const elementObj = {};

  elementObj.height = gridAreaInPixel[2] - gridAreaInPixel[0];
  elementObj.width = gridAreaInPixel[3] - gridAreaInPixel[1];
  elementObj.left = gridAreaInPixel[1];
  elementObj.top = gridAreaInPixel[0];

  return elementObj;
}

function parseRowsColumnsFromGridArea(element) {
  return element.style.gridArea.match(/-?\d+/g);
}

export function nestGridLines(container, gridBoxSize) {
  const [rowStart, colStart, rowEnd, colEnd] = parseRowsColumnsFromGridArea(
    container
  );

  const rowsCount = rowEnd - rowStart;
  const colsCount = colEnd - colStart;

  container.style.display = "grid";
  container.style.gridTemplate = `repeat(${rowsCount}, ${gridBoxSize}px) / repeat(${colsCount}, ${gridBoxSize}px)`;
  container.style.gridAutoColumns = `${gridBoxSize}px`;
  container.style.gridAutoRows = `${gridBoxSize}px`;
}

export function getXYRelativeToParent(container, { x, y }) {
  const { top, left } = getDimensionInPixelFromGridArea(container, gridBoxSize);
  return { relativeX: x - left, relativeY: y - top };
}

export function getTotalTopLeftOffset(containers) {
  let offsetTop = 0;
  let offsetLeft = 0;

  for (let index = 0; index < containers.length; index++) {
    const { top, left } = getDimensionInPixelFromGridArea(
      containers[index],
      gridBoxSize
    );
    offsetTop += top;
    offsetLeft += left;
  }

  return { offsetTop, offsetLeft };
}

export function getFirstParentOrCanvasIfNoneExists(parents) {
  return parents.length
    ? parents[parents.length - 1]
    : document.getElementById("canvas");
}
