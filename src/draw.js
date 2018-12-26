const CEIL = "ceil";
const ROUND = "round";

function snapToGridLine(val, gridBoxSize, { force } = { force: false }) {
  const snapCandidate = gridBoxSize * Math.round(val / gridBoxSize);

  if (force) {
    return snapCandidate;
  }

  if (Math.abs(val - snapCandidate) < 10) {
    return snapCandidate;
  } else {
    return val;
  }
}

function roundPixelToGridBoxes(pixel, gridBoxSize, snapBehaviour = ROUND) {
  return Math[snapBehaviour](parseFloat(pixel) / gridBoxSize);
}

function snapElementToGrid(
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

function createDragAnchorElement(element) {
  const dragAnchor = document.createElement("span");
  dragAnchor.className = "drag-anchor";
  element.appendChild(dragAnchor);
}

function getOffsetXandY(element) {
  return element.style.transform.match(/-?\d+/g);
}

function normalizeTransformToGrid(element, gridBoxSize) {
  const offset = getOffsetXandY(element);
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
  element = null;
}

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  const mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

  let clicks = 0;
  let firstClickTimeout;
  let firstClickedElement;
  let isCreatingContainer = false;
  let currentContainerId;
  let isEditingMode = false;
  let isDragAnchorClicked = false;
  let element = null;
  const startPointEle = document.getElementById("startPoint");

  function destroyContainer(currentContainerId) {
    if (currentContainerId) {
      const container = document.getElementById(currentContainerId);
      if (container) {
        container.remove();
      }
    }
    element = null;
  }

  function setMousePosition(e) {
    const ev = e || window.event; //Moz || IE
    if (ev.pageX) {
      //Moz
      mouse.x = ev.pageX + window.pageXOffset;
      mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) {
      //IE
      mouse.x = ev.clientX + document.body.scrollLeft;
      mouse.y = ev.clientY + document.body.scrollTop;
    }
  }

  function completeContainerCreation(element, gridBoxSize) {
    snapElementToGrid(element, gridBoxSize);
    createDragAnchorElement(element);
    canvas.style.cursor = "default";
    element.removeAttribute("id");
    element = null;
    console.log("div container creation finsihed.");
  }

  /* Creating div container on first click on anywhere in canvas */
  function createContainer() {
    console.log("div container creation begun.");
    isCreatingContainer = true;
    currentContainerId = Math.random();
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
    element = document.createElement("div");
    element.className = "rectangle";
    element.id = currentContainerId;
    element.style.position = "absolute";
    element.style.left = mouse.x + "px";
    element.style.top = mouse.y + "px";
    canvas.appendChild(element);
  }

  function initTextNodeCreation(e) {
    console.log("creating text node");
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
    const x = snapToGridLine(mouse.startX, gridBoxSize, { force: true });
    const y = snapToGridLine(mouse.startY, gridBoxSize, { force: true });

    const container = document.createElement("div");
    currentContainerId = Math.random();
    container.id = currentContainerId;
    container.className = "rectangle";
    container.style.position = "absolute";
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

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
    paragraph.onclick = e => {
      console.log("e", e.target.style);
      // setTimeout(() => (e.target.style.userSelect = "auto"), 0);
    };
    container.appendChild(paragraph);
    e.target.appendChild(container);
    paragraph.focus();
  }

  function completeTextNodeCreation(e) {
    console.log(e);
    if (!e.target.innerText) {
      // refocus previous paragraph if user single clicks elsewhere
      // while the startpoint is active
      setTimeout(() => e.target.focus(), 0);
      return;
    }
    e.target.parentNode.removeAttribute("id");
    snapElementToGrid(e.target.parentNode, gridBoxSize, {
      snapBehaviour: CEIL
    });
  }

  canvas.onmousemove = e => {
    setMousePosition(e);

    if (isDragAnchorClicked) {
      const x = snapToGridLine(mouse.x - mouse.startX, gridBoxSize);
      const y = snapToGridLine(mouse.y - mouse.startY, gridBoxSize);
      canvas.style.cursor = "move";
      element.style.transform = `translate(${x}px, ${y}px)`;
    } else if (isCreatingContainer) {
      startPointEle.style.opacity = 0;
      canvas.style.cursor = "crosshair";
      const snapToGridX = snapToGridLine(mouse.x, gridBoxSize);
      const snapToGridY = snapToGridLine(mouse.y, gridBoxSize);
      const snappedStartX = snapToGridLine(mouse.startX, gridBoxSize, {
        force: true
      });
      const snappedStartY = snapToGridLine(mouse.startY, gridBoxSize, {
        force: true
      });

      element.style.width = `${Math.abs(snapToGridX - snappedStartX)}px`;
      element.style.height = `${Math.abs(snapToGridY - snappedStartY)}px`;
      element.style.left =
        mouse.x - snappedStartX < 0 ? `${snapToGridX}px` : `${snappedStartX}px`;
      element.style.top =
        mouse.y - snappedStartY < 0 ? `${snapToGridY}px` : `${snappedStartY}px`;
    }
  };

  canvas.onmouseup = () => {
    if (isDragAnchorClicked) {
      isDragAnchorClicked = false;
      canvas.style.cursor = "default";
      normalizeTransformToGrid(element, gridBoxSize);
    } else if (isCreatingContainer) {
      isCreatingContainer = false;

      // if mouse meant to create cont hasn't moved since clicked
      // on start point, then remove the cont
      if (
        Math.abs(mouse.x - mouse.startX) < 10 &&
        Math.abs(mouse.y - mouse.startY) < 10
      ) {
        destroyContainer(currentContainerId);
        return;
      }

      completeContainerCreation(element, gridBoxSize);
    }
  };

  function positionStartPoint() {
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;

    destroyContainer(currentContainerId);

    const x = snapToGridLine(mouse.startX, gridBoxSize, { force: true });
    const y = snapToGridLine(mouse.startY, gridBoxSize, { force: true });

    startPointEle.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    startPointEle.style.opacity = 1;
  }

  /* Distinguish single click or double click */
  canvas.onclick = e => {
    // if (isEditingMode) {
    //   isEditingMode = false;
    //   console.log("hell");
    //   return;
    // }
    clicks++;
    if (clicks === 1) {
      firstClickedElement = e;
      /* if this runs then for sure it was single click */
      firstClickTimeout = setTimeout(() => (clicks = 0), 250);
    } else {
      /* it was a double click */
      console.log("double click");
      positionStartPoint();
      initTextNodeCreation(firstClickedElement);
      clearTimeout(firstClickTimeout);
      clicks = 0;
    }
  };

  canvas.onmousedown = function(e) {
    if (e.target.className === "drag-anchor") {
      console.log("Clicked drag anchor ");
      isDragAnchorClicked = true;
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      // prevents after onmouseup, the click event won't
      // bubble up to the canvas's onclick handler
      e.target.onclick = e => e.stopPropagation();
      element = e.target.parentNode;
    } else if (e.target.id === "startPoint") {
      isCreatingContainer = true;
      // this is the container of paragraph. removes it since user opt
      // for container creation
      destroyContainer(currentContainerId);
      createContainer();
    }
  };
}
