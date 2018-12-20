function snapToGridLine(val, gridBoxSize) {
  var snap_candidate = gridBoxSize * Math.round(val / gridBoxSize);
  console.log(snap_candidate);
  console.log(snap_candidate);
  if (Math.abs(val - snap_candidate) < 10) {
    return snap_candidate;
  } else {
    return null;
  }
}

function snapElementToGrid(element, gridBoxSize) {
  const top = Math.round(parseFloat(element.style.top) / gridBoxSize);
  const left = Math.round(parseFloat(element.style.left) / gridBoxSize);
  const width = Math.round(parseFloat(element.style.width) / gridBoxSize);
  const height = Math.round(parseFloat(element.style.height) / gridBoxSize);

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
  const offsetGridBoxesX = offset[0] / gridBoxSize;
  const offsetGridBoxesY = offset[1] / gridBoxSize;

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

  canvas.onmousemove = function(e) {
    setMousePosition(e);

    if (isDragAnchorClicked) {
      const snapToGridX = snapToGridLine(mouse.x - mouse.startX, gridBoxSize);
      const snapToGridY = snapToGridLine(mouse.y - mouse.startY, gridBoxSize);

      const x = snapToGridX ? snapToGridX : mouse.x - mouse.startX;
      const y = snapToGridY ? snapToGridY : mouse.y - mouse.startY;

      element.style.transform = `translate(${x}px, ${y}px)`;
    } else if (element !== null) {
      const snapToGridX = snapToGridLine(mouse.x, gridBoxSize);
      const snapToGridY = snapToGridLine(mouse.y, gridBoxSize);

      element.style.width =
        Math.abs(
          snapToGridX ? snapToGridX - mouse.startX : mouse.x - mouse.startX
        ) + "px";
      element.style.height =
        Math.abs(
          snapToGridY ? snapToGridY - mouse.startY : mouse.y - mouse.startY
        ) + "px";
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

  canvas.onmousedown = function(e) {
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
    if (e.target.className === "drag-anchor") {
      element = e.target.parentNode;
      isDragAnchorClicked = true;
    } else if (element !== null) {
      snapElementToGrid(element, gridBoxSize);
      createDragAnchorElement(element);
      element = null;
      canvas.style.cursor = "default";
      console.log("finsihed.");
    } else {
      console.log("begun.");
      element = document.createElement("div");
      element.className = "rectangle";
      element.style.left = mouse.x + "px"; // TODO: use translateX and Y instead
      element.style.top = mouse.y + "px";
      element.style.position = "absolute";
      canvas.appendChild(element);
      canvas.style.cursor = "crosshair";
    }
  };
}
