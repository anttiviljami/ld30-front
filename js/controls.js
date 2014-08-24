/**
 * Filename: controls.js
 * Project: Ludum Dare 30 Entry
 * Copyright: (c) 2014 Ludum Dare Team Tampere
 * License: The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * Game controls
 */

// control state flags
var drawing = dragging = false;

// miscellaneous
var dragOrigin, currTile, currPoint, currCoord, prevCoord, prevPoint,
    connectionPath, pointerTile;

/*
 * Sets up event listeners for controls
 */
function initControls() {
  stage.addEventListener('stagemousedown', onMouseDown);
  stage.addEventListener('stagemouseup', onMouseUp);
  stage.addEventListener('stagemousemove', onMouseMove);
}

/*
 * Global mouse down event handler
 */
function onMouseDown(e) {

  // mouse position in game world as a point
  currPoint = map.globalToLocal(e.stageX, e.stageY);
  // mouse position in game world as a coordinate
  currCoord = pointToCoord(currPoint);
  // the tile at the mouse's coordinate
  currTile = getTile(currCoord.q, currCoord.r);

  if (e.nativeEvent.button === 0) { // left mouse button pressed
    drawing = true;

    // start drawing a connection path from current coordinate
    connectionPath = [ JSON.stringify(currCoord) ];

    // DEBUG: log the mouse coordinate 
    console.log(pointToCoord(currPoint));
  } 

  if (e.nativeEvent.button === 2) { // right mouse button pressed    
    dragging = true;

    // retain the point where the drag event was started
    dragOrigin = { 
      x: e.stageX - map.x * cam.scaleX, 
      y: e.stageY - map.y * cam.scaleY,
    };
  } 
}

/*
 * Global mouse move event handler
 */
function onMouseMove(e) {

  // mouse position in game world as a point
  currPoint = map.globalToLocal(e.stageX, e.stageY);
  // mouse position in game world as a coordinate
  currCoord = pointToCoord(currPoint);
  // the tile at the mouse's coordinate
  currTile = getTile(currCoord.q, currCoord.r);

  if(drawing) { // left mouse button down
    
    /*var dist = distance(prevPoint, currPoint);
    var unit = normalize({
      x: currPoint.x - prevPoint.x, 
      y: currPoint.y - prevPoint.y,
    });

    console.log(prevPoint + currPoint);

    for(var s = 0; s <= dist; s += 45) {

      var testCoord = pointToCoord({
        x: prevPoint.x + unit.x * s,
        y: prevPoint.y + unit.y * s,
      });

      // store tiles in connection path array
      if(!_.contains(connectionPath, JSON.stringify(testCoord))) {
        connectionPath.push(JSON.stringify(testCoord));
        PointerTile(testCoord.q, testCoord.r);
      };

    }*/

    // store tiles in connection path array
    if(!_.contains(connectionPath, JSON.stringify(currCoord))) {
      connectionPath.push(JSON.stringify(currCoord));
      //PointerTile(currCoord.q, currCoord.r);
    };

  }

  if(dragging) { // right mouse button down
    // drag the map
    map.x = (e.stageX - dragOrigin.x) / cam.scaleX;
    map.y = (e.stageY - dragOrigin.y) / cam.scaleY;
  }

  if(JSON.stringify(prevCoord) != JSON.stringify(currCoord)) {
    // coordinate has changed since last move event

    // remove the pointer tile
    map.removeChild(pointerTile);

    if(!currTile) { // are we hovering on an empty block?
      // display a pointer tile at coordinate
      new PointerTile(currCoord.q, currCoord.r);
    } 
  }

  // retain last values
  prevCoord = currCoord;
  prevPoint = currPoint;
}


/*
 * Global mouse up event handler
 */
function onMouseUp(e) {
  if ( e.nativeEvent.button === 0 ) { 
    drawing = false;
    connectionPath = _.map(connectionPath, function(e) { return JSON.parse(e) })
    console.log(JSON.stringify(connectionPath));
  }
  if ( e.nativeEvent.button === 2 ) { 
    dragging = false;
  }
}
