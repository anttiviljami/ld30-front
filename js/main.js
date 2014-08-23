/**
 * main.js
 */

// variables in global scope
var stage, w, h, loader;
var cam, map;
var maskBounds, dragOrigin, currentTile, currentCoord, prevCoord;
var drawing = dragging = false;
var connectionPath, emptytile;

var sortDraw = true;

var tiles = {};

/*
 * This gets loaded initally
 */
function init() {

  // disable context menu
  var canvas = document.getElementById('stage');
  
  canvas.oncontextmenu = function() { return false; };
  window.addEventListener('resize', resize);


  // manifest 
  var manifest = [
    {src:'assets/tile_mask.png', id:'tile_mask'},
      
    // tiles
    {src:'assets/yellow/tile_yellow.png', id:'tile_yellow'},
    {src:'assets/yellow/server_yellow.png', id:'server_yellow'},
    {src:'assets/yellow/dome_yellow.png', id:'dome_yellow'},
      
    {src:'assets/blue/tile_blue.png', id:'tile_blue'},
    {src:'assets/blue/server_blue.png', id:'server_blue'},
    {src:'assets/blue/dome_blue.png', id:'dome_blue'},
      
    {src:'assets/gray/tile_gray.png', id:'tile_gray'},
    {src:'assets/gray/server_gray.png', id:'server_gray'},
    {src:'assets/gray/dome_gray.png', id:'dome_gray'},
      
    {src:'assets/red/tile_red.png', id:'tile_red'},
    {src:'assets/red/server_red.png', id:'server_red'},
    {src:'assets/red/dome_red.png', id:'dome_red'},

    {src:'assets/tile_empty.png', id:'tile_empty'},
      
    // animations
    {src:'assets/animations/pulsate.json', id:'pulsate_data'},
    {src:'assets/animations/pulsate_reverse.json', id:'pulsate_reverse_data'},
    {src:'assets/animations/circle_dark.json', id:'circle_dark_data'},
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener('complete', onLoad);
  loader.loadManifest(manifest);
}

/*
 * Once all assets are loaded
 */
function onLoad() {

  // the main stage
  stage = new createjs.Stage('stage');

  // the camera
  cam = new createjs.Container();
  stage.addChild(cam);

  cam.scaleX = cam.scaleY = 0.75;

  resize();

  // the game world
  map = new createjs.Container();
  cam.addChild(map);

  // enable some mouse events
  stage.enableMouseOver();

  // grab canvas width and height for later calculations:
  w = stage.canvas.width;
  h = stage.canvas.height;

  // global mouse down and mouse up events
  stage.addEventListener('stagemousedown', onMouseDown);
  stage.addEventListener('stagemouseup', onMouseUp);
  stage.addEventListener('stagemousemove', onMouseMove);


  // grab tile mask bounds for later use
  maskBounds = new createjs.Bitmap(loader.getResult('tile_mask')).getBounds();

  for (var r = 0; r < 12; ++r) {

    for (var q = 1; q < 15; ++q) {
      
      var color;
      var rand = Math.round(Math.random() * 4);
      
      switch(rand) {
        case 0: color = "gray";
      		break;
        case 1: color = "yellow";
      		break;
       case 2: color = "blue";
      		break;
        case 3: color = "red";
      	  break;
      }
    
      var tile = new Datacenter(color , q, r);

      tile.on('rollover', function() {
        this.children[0].y = -11;
      });

      tile.on('rollout', function() {
        this.children[0].y = 0;
      });

      tile.on('click', function(e) {
        if ( e.nativeEvent.button === 0 ) { 
          console.log(map.getChildIndex(this));
        }
      });

    }
  }
  
  
  var tile2 = new Datacenter("blue" , 25, 0);

  // set timing mode
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', onTick);

}

function onTick(event) {
  //console.log('tick');
  
  if(sortDraw) {
    // draw order algorithm
    map.sortChildren(sortByRow);
    sortDraw = false;
  }

  stage.update(event);
}

function onMouseDown(e) {
  //console.log(e);
  var worldPoint = map.globalToLocal(e.stageX, e.stageY);
  currentCoord = pointToCoord(worldPoint);
  currentTile = getTile(currentCoord.q, currentCoord.r);

  if ( e.nativeEvent.button === 0 ) { 
    drawing = true;
    connectionPath = [ JSON.stringify(pointToCoord(worldPoint)) ];
  } 

  if ( e.nativeEvent.button === 2 ) { 
    dragging = true;
    dragOrigin = {x: e.stageX - map.x * cam.scaleX, y: e.stageY - map.y * cam.scaleX};
  } 

  console.log(pointToCoord(worldPoint));
  
}

function onMouseUp(e) {
 // console.log(e);

  if ( e.nativeEvent.button === 0 ) { 
    drawing = false;
    connectionPath = _.map(connectionPath, function(e) { return JSON.parse(e) })
    console.log(JSON.stringify(connectionPath));
  }
  if ( e.nativeEvent.button === 2 ) { 
    dragging = false;
  }
  
}

function onMouseMove(e) {
  //console.log(e);

  var worldPoint = map.globalToLocal(e.stageX, e.stageY);
  currentCoord = pointToCoord(worldPoint);
  currentTile = getTile(currentCoord.q, currentCoord.r);

  if(JSON.stringify(prevCoord) != JSON.stringify(currentCoord)) {

    map.removeChild(emptytile);

    if(!currentTile) {
      // hovering on an empty block

      console.log('empty');

      emptytile = new createjs.Container();
      emptytile.addChild(new createjs.Bitmap(loader.getResult('tile_empty')));
      
      var pos = coordToPoint({q: currentCoord.q, r: currentCoord.r});
      emptytile.x = pos.x;
      emptytile.y = pos.y;

      emptytile.q = currentCoord.q;
      emptytile.r = currentCoord.r;

      emptytile.alpha = .4;

      //animate on hover
      //emptytile.on('tick', oscillate);

      map.addChild(emptytile);
      sortDraw = true;

    } 

  }

  if(drawing) {
    if(!_.contains(connectionPath, JSON.stringify(currentCoord))) {
      connectionPath.push(JSON.stringify(currentCoord));
    };
  }

  if(dragging) {
    // moving the camera

    map.x = (e.stageX - dragOrigin.x) / cam.scaleX;
    map.y = (e.stageY - dragOrigin.y) / cam.scaleY;
  }

  // retain last coord
  prevCoord = currentCoord;

}

function getTile(q, r) {
  return tiles[q] ? tiles[q][r] : null;
}

function coordToPoint(coord) {
  
  point = {};
  
  point.x = coord.q * maskBounds.width * 3/4;
  point.y = coord.r * maskBounds.height + (coord.q % 2) * maskBounds.height / 2;

  return point;
}

function pointToCoord(point) {
  
  coord = {};

  // this is kinda hard...

  // first let's do a rough approximation of the value 
  coord.q = Math.floor(point.x / (maskBounds.width * 3/4));
  coord.r = Math.floor(point.y / maskBounds.height);
 
  // then we populate the general area with tiles
  for (var r = -1; r <= 1; ++r) { //TODO: optimise test tiles
    for (var q = -1; q <= 1; ++q) {
      
      var test = new createjs.Container();
      var tile = new createjs.Bitmap(loader.getResult('tile_mask'));
      test.hitArea = tile;

      var testCoord = {q: coord.q + q, r: coord.r + r};

      var position = coordToPoint(testCoord);
      test.x = position.x;
      test.y = position.y;

      map.addChild(test);

      // this enables hit detection for some reason...
      test.on('rollover', function() {});

      if(_.contains(map.getObjectsUnderPoint(point.x, point.y), test)) {
        map.removeChild(test);
        return testCoord
      };
      map.removeChild(test);
    }
  }

}

function sortByRow(a,b) {
  var aIndex = 20000 * a.r + 10000 * !(a.q % 2 == 0) + a.q; // simple statement
  var bIndex = 20000 * b.r + 10000 * !(b.q % 2 == 0) + b.q; // easy, isn't it?

  if (aIndex < bIndex) return -1;
  if (aIndex > bIndex) return 1;
  return 0;
}

function oscillate(e) {
  _.each(this.children, function (e) { 
    e.y = -( Math.sin(createjs.Ticker.getTime() / 500)) * 8;
  });
}

function resize() {
  stage.canvas.width = document.body.clientWidth; 
  stage.canvas.height = document.body.clientHeight; 

  cam.x = stage.canvas.width / 2;
  cam.y = stage.canvas.height / 2;
}

init();

