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

function roundPixelToGridLine(pixel, gridBoxSize, snapBehaviour = ROUND) {
  return Math[snapBehaviour](parseFloat(pixel) / gridBoxSize);
}

function roundPixelToGridBoxes(pixel, gridBoxSize) {
  return gridBoxSize * Math.round(pixel / gridBoxSize);
}

const CEIL = "ceil";
const ROUND = "round";

export function snapElementToGridFromPixelDimension(
  element,
  gridBoxSize,
  { top, left, width, height } = { top: 0, left: 0, width: 0, height: 0 }
) {
  const roundedTop = roundPixelToGridLine(
    top || element.style.top,
    gridBoxSize
  );
  const roundedLeft = roundPixelToGridLine(
    left || element.style.left,
    gridBoxSize
  );
  const roundedWidth = roundPixelToGridLine(
    width || element.style.width || element.clientWidth,
    gridBoxSize
  );
  const roundedHeight = roundPixelToGridLine(
    height || element.style.height || element.clientHeight,
    gridBoxSize
  );

  element.style.gridRowStart = roundedTop + 1;
  element.style.gridColumnStart = roundedLeft + 1;
  element.style.gridRowEnd = roundedTop + roundedHeight + 1;
  element.style.gridColumnEnd = roundedLeft + roundedWidth + 1;

  element.style.position = "relative";
  element.style.top = "";
  element.style.left = "";
  element.style.width = "";
  element.style.height = "";
}

// x, y will be the top-left coordinate
export function snapElementToGridFromDragging(x, y, element, gridBoxSize) {
  const { width, height } = getDimensionInPixelFromGridArea(
    element,
    gridBoxSize
  );
  const left = roundPixelToGridBoxes(x, gridBoxSize);
  const top = roundPixelToGridBoxes(y, gridBoxSize);
  const dropInContainer = document.elementFromPoint(left, top);
  console.log("dropincontainer", dropInContainer);
  if (dropInContainer.id === "canvas") {
    snapElementToGridFromPixelDimension(element, gridBoxSize, {
      width,
      height,
      top,
      left
    });
    element.style.transform = "";
    dropInContainer.appendChild(element);
  } else if (dropInContainer.classList.contains("rectangle")) {
    const parents = getAllParentContainers(dropInContainer, "rectangle");
    const lastParent = parents[parents.length - 1];
    const { relativeX, relativeY } = getXYRelativeToParent(lastParent, {
      x: left,
      y: top
    });
    snapElementToGridFromPixelDimension(element, gridBoxSize, {
      width,
      height,
      top: relativeY,
      left: relativeX
    });
    element.style.transform = "";
    dropInContainer.appendChild(element);
  }
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
  console.log("offset", offset);
  const offsetGridBoxesX = roundPixelToGridLine(offset[0], gridBoxSize);
  const offsetGridBoxesY = roundPixelToGridLine(offset[1], gridBoxSize);

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

export function getLastParentOrCanvasIfNoneExists(parents) {
  return parents.length
    ? parents[parents.length - 1]
    : document.getElementById("canvas");
}
