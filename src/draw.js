function snapToGridLine(val, gridBoxSize) {
  var snap_candidate = gridBoxSize * Math.round(val / gridBoxSize);
  if (Math.abs(val - snap_candidate) < 5) {
    return snap_candidate;
  } else {
    return null;
  }
}

function snapElementToGrid(element, gridBoxSize) {
  let top = parseFloat(element.style.top);
  let left = parseFloat(element.style.left);
  let width = parseFloat(element.style.width);
  let height = parseFloat(element.style.height);

  top = gridBoxSize * Math.round(top / gridBoxSize);
  left = gridBoxSize * Math.round(left / gridBoxSize);
  width = gridBoxSize * Math.round(width / gridBoxSize);
  height = gridBoxSize * Math.round(height / gridBoxSize);

  element.style["grid-column-start"] = left / gridBoxSize + 1;
  element.style["grid-column-end"] = (left + width) / gridBoxSize + 1;
  element.style["grid-row-start"] = top / gridBoxSize + 1;
  element.style["grid-row-end"] = (top + height) / gridBoxSize + 1;

  element.style.top = "";
  element.style.left = "";
  element.style.width = "";
  element.style.height = "";
  element.style.position = "";
}

function enableDragAndResize(element, gridBoxSize) {}

// adapted from https://stackoverflow.com/a/17409472/73323
export function initDraw(canvas, gridBoxSize) {
  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

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

  var element = null;
  canvas.onmousemove = function(e) {
    setMousePosition(e);
    const snapToGridX = snapToGridLine(mouse.x, gridBoxSize);
    const snapToGridY = snapToGridLine(mouse.y, gridBoxSize);

    if (element !== null) {
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

  canvas.onclick = function(e) {
    if (element !== null) {
      snapElementToGrid(element, gridBoxSize);
      enableDragAndResize(element, gridBoxSize);
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
