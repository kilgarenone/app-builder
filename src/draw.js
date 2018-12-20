function snapToGridLine(val, gridBoxSize) {
  var snap_candidate = gridBoxSize * Math.round(val / gridBoxSize);
  if (Math.abs(val - snap_candidate) < 5) {
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

  element.setAttribute(
    "data-grid",
    `${gridRowStart}/${gridColumnStart}/${gridRowEnd}/${gridColumnEnd}`
  );

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

function convertGridToPixel(grid, gridBoxSize) {
  return grid.split("/").map(grid => (grid - 1) * gridBoxSize);
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
  let offset = [0, 0];
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
    const snapToGridX = snapToGridLine(mouse.x, gridBoxSize);
    const snapToGridY = snapToGridLine(mouse.y, gridBoxSize);

    if (isDragAnchorClicked) {
      element.style.transform = `translate3d(${mouse.x -
        offset[0]}px, ${mouse.y - offset[1]}px, 0)`;
    } else if (element !== null) {
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
      element = null;
      offset[0] = 0;
      offset[1] = 0;
    }
  };

  canvas.onmousedown = function(e) {
    if (e.target.className === "drag-anchor") {
      element = e.target.parentNode;
      const gridToPixel = convertGridToPixel(element.dataset.grid, gridBoxSize);
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      offset[0] = mouse.startX;
      offset[1] = mouse.startY;
      console.log(offset);
      isDragAnchorClicked = true;
    } else if (element !== null) {
      snapElementToGrid(element, gridBoxSize);
      createDragAnchorElement(element);
      element = null;
      canvas.style.cursor = "default";
      console.log("finsihed.");
    } else {
      console.log("begun.");
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement("div");
      element.className = "rectangle";
      element.style.left = mouse.x + "px";
      element.style.top = mouse.y + "px";
      element.style.position = "absolute";
      canvas.appendChild(element);
      canvas.style.cursor = "crosshair";
    }
  };
}
