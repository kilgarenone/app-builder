function snapToGridLine(val, gridBoxSize) {
  var snap_candidate = gridBoxSize * Math.round(val / gridBoxSize);
  if (Math.abs(val - snap_candidate) < 10) {
    return snap_candidate;
  } else {
    return val;
  }
}

function roundPixelToGridBoxes(pixel, gridBoxSize) {
  return Math.round(parseFloat(pixel) / gridBoxSize);
}

function snapElementToGrid(element, gridBoxSize) {
  const top = roundPixelToGridBoxes(element.style.top, gridBoxSize);
  const left = roundPixelToGridBoxes(element.style.left, gridBoxSize);
  const width = roundPixelToGridBoxes(element.style.width, gridBoxSize);
  const height = roundPixelToGridBoxes(element.style.height, gridBoxSize);

  const gridColumnStart = left + 1;
  const gridColumnEnd = left + width + 1;
  const gridRowStart = top + 1;
  const gridRowEnd = top + height + 1;

  element.style["grid-row-start"] = gridRowStart;
  element.style["grid-column-start"] = gridColumnStart;
  element.style["grid-row-end"] = gridRowEnd;
  element.style["grid-column-end"] = gridColumnEnd;

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
  const offsetGridBoxesX = roundPixelToGridBoxes(offset[0], gridBoxSize);
  const offsetGridBoxesY = roundPixelToGridBoxes(offset[1], gridBoxSize);

  element.style.gridRowStart = +element.style.gridRowStart + offsetGridBoxesY;
  element.style.gridColumnStart =
    +element.style.gridColumnStart + offsetGridBoxesX;
  element.style.gridRowEnd = +element.style.gridRowEnd + offsetGridBoxesY;
  element.style.gridColumnEnd = +element.style.gridColumnEnd + offsetGridBoxesX;

  element.style.transform = "";
}

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

  let clicks = 0;
  let firstClickTimeout;
  let currentContainerId;
  let isDragAnchorClicked = false;
  var element = null;

  function setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
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

  function createContainer() {
    if (element !== null) {
      element.removeAttribute("id");
      snapElementToGrid(element, gridBoxSize);
      createDragAnchorElement(element);
      element = null;
      canvas.style.cursor = "default";
      console.log("finsihed.");
    } else {
      currentContainerId = Math.random();
      console.log("begun.");
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement("div");
      element.className = "rectangle";
      element.id = currentContainerId;
      element.style.left = mouse.x + "px"; // TODO: use translateX and Y instead
      element.style.top = mouse.y + "px";
      element.style.position = "absolute";
      canvas.appendChild(element);
    }
  }

  function destroyContainer() {
    document.getElementById(currentContainerId).remove();
    element = null;
  }

  canvas.onmousemove = function(e) {
    setMousePosition(e);

    if (isDragAnchorClicked) {
      const x = snapToGridLine(mouse.x - mouse.startX, gridBoxSize);
      const y = snapToGridLine(mouse.y - mouse.startY, gridBoxSize);

      element.style.transform = `translate(${x}px, ${y}px)`;
    } else if (element !== null) {
      const snapToGridX = snapToGridLine(mouse.x, gridBoxSize);
      const snapToGridY = snapToGridLine(mouse.y, gridBoxSize);

      element.style.width = Math.abs(snapToGridX - mouse.startX) + "px";
      element.style.height = Math.abs(snapToGridY - mouse.startY) + "px";
      element.style.left =
        mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
      element.style.top =
        mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
    }
  };

  canvas.onmouseup = function() {
    if (isDragAnchorClicked) {
      isDragAnchorClicked = false;
      normalizeTransformToGrid(element, gridBoxSize);
      element = null;
    }
  };

  canvas.onclick = () => {
    clicks++;
    if (clicks === 1) {
      createContainer();
      firstClickTimeout = setTimeout(() => {
        clicks = 0;
        if (element) {
          canvas.style.cursor = "crosshair";
        }
      }, 300);
    } else {
      clearTimeout(firstClickTimeout);
      console.log("double click");
      destroyContainer();
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
    }
  };
}
