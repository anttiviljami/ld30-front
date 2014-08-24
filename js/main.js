/**
 * Filename: main.js
 * Project: Ludum Dare 30 Entry
 * Copyright: (c) 2014 Ludum Dare Team Tampere
 * License: The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * Main logic for the game
 */


// main game objects
var stage, canvas, loader;

// camera and game world container
var cam, map;

// miscellaneous
var maskBounds, dragOrigin, currentTile, currentPoint, currentCoord, prevCoord, 
    connectionPath, pointerTile;

// control state flags
var drawing = dragging = false;

// controls whether to recalculate draw order
var sortDraw = true;

// a multi-dimensional collection of game tiles
var tiles = {};

// a multi-dimensional collection for keeping in sync with backend
var server = {};


/*
 * Entry point, gets called on game start
 */
function init() {
  var manifest = [

    // hex tile shape and dimensions
    {src:'assets/tile_mask.png', id:'tile_mask'},
      
    // spritesheets
    {src:'assets/blue/tile_blue.png', id:'tile_blue'},
    {src:'assets/blue/server_blue_v2.png', id:'server_blue'},
    {src:'assets/blue/dome_blue.png', id:'dome_blue'},
    {src:'assets/blue/factory_blue.png', id:'factory_blue'},

    {src:'assets/red/tile_red.png', id:'tile_red'},
    {src:'assets/red/server_red_v2.png', id:'server_red'},
    {src:'assets/red/dome_red.png', id:'dome_red'},
    {src:'assets/red/factory_red.png', id:'factory_red'},

    {src:'assets/yellow/tile_yellow.png', id:'tile_yellow'},
    {src:'assets/yellow/server_yellow_v2.png', id:'server_yellow'},
    {src:'assets/yellow/dome_yellow.png', id:'dome_yellow'},
    {src:'assets/yellow/factory_yellow.png', id:'factory_yellow'},
    
    {src:'assets/gray/tile_gray.png', id:'tile_gray'},
    {src:'assets/gray/server_gray_v2.png', id:'server_gray'},
    {src:'assets/gray/dome_gray.png', id:'dome_gray'},
    {src:'assets/gray/factory_gray.png', id:'factory_gray'},
    
    {src:'assets/tile_empty.png', id:'tile_empty'},
      
    // animations
    {src:'assets/animations/pulsate.json', id:'pulsate_data'},
    {src:'assets/animations/pulsate_reverse.json', id:'pulsate_reverse_data'},
    {src:'assets/animations/circle_dark.json', id:'circle_dark_data'},
  ];

  //Connect to server
  server = new Server();
  server.init();

  // preload all assets declared in the manifest
  loader = new createjs.LoadQueue(false);
  loader.addEventListener('complete', gameInit);
  loader.loadManifest(manifest);
}


/*
 * Gets called when game assets are loaded
 */
function gameInit() {

  // main canvas
  canvas = document.getElementById('stage'); 

  // disable the right click menu
  canvas.oncontextmenu = function() { return false; };

  // initalize the main stage
  stage = new createjs.Stage('stage');

  // set up the game loop
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', onTick);

  // the game camera
  cam = new createjs.Container(); 
  stage.addChild(cam);

  // the game world
  map = new createjs.Container();
  cam.addChild(map);

  // canvas should fill the browser window
  window.addEventListener('resize', onResize);
  onResize();

  // initial scale is 50%
  cam.scaleX = cam.scaleY = 0.5;

  // enable some mouse events
  stage.enableMouseOver();

  // set up global mouse events
  initControls();

  // grab tile mask bounds for later use
  maskBounds = new createjs.Bitmap(loader.getResult('tile_mask')).getBounds();

  // DEBUG: Generate some random tiles
  generateRandomTiles();
}


/*
 * Tick handler
 */
function onTick(e) {
  
  if(sortDraw) {
    // recalculate the draw order
    map.sortChildren(sortByRow);
    sortDraw = false;
  }

  // render stage
  stage.update(e);
}


/*
 * Return a tile from the global tiles collection
 */
function getTile(q, r) {
  return tiles[q] ? tiles[q][r] : null;
}


/*
 * Converts a hex grid coordinate to a local point
 */
function coordToPoint(coord) {
  // easy! just some squiggly rows to do.
  
  point = {};
  
  point.x = coord.q * maskBounds.width * 3/4;
  point.y = coord.r * maskBounds.height + (coord.q % 2) * maskBounds.height / 2;

  return point;
}

/*
 * Converts a local point to a hex grid coordinate
 */
function pointToCoord(point) {
  // this is kinda hard...

  coord = {};

  // first let's do a rough approximation of the value 
  coord.q = Math.floor(point.x / (maskBounds.width * 3/4));
  coord.r = Math.floor(point.y / maskBounds.height);
 
  // then we populate the general area with test tiles
  for (var r = -1; r <= 1; ++r) { 
    for (var q = -1; q <= 1; ++q) { //TODO: optimise sample sizes
      
      // spawn a test bitmap
      var test = new createjs.Bitmap(loader.getResult('tile_mask'));
      var testCoord = {q: coord.q + q, r: coord.r + r};
      var testPoint = coordToPoint(testCoord);

      test.x = testPoint.x;
      test.y = testPoint.y;

      map.addChild(test);

      // this is required to enable hit detection for some reason...
      test.on('rollover', function() {});

      // check to see if this tile is under point
      if(_.contains(map.getObjectsUnderPoint(point.x, point.y), test)) {
        map.removeChild(test); // dispose of the test tile and return coord
        return testCoord;
      };

      map.removeChild(test); // dispose of the test tile
    }
  }
}


/*
 * Display a visible pointer tile at coordinate
 */
function PointerTile(q, r) {
  pointerTile = new createjs.Container();
  pointerTile.addChild(new createjs.Bitmap(loader.getResult('tile_empty')));
  
  // save coordinates
  pointerTile.q = q;
  pointerTile.r = r;

  // position the block
  var pos = coordToPoint({q: q, r: r});
  pointerTile.x = pos.x;
  pointerTile.y = pos.y;
  
  pointerTile.alpha = .4; // transparency

  map.addChild(pointerTile);
  sortDraw = true; // recalculate draw order

  return this;
}

/*
 * DEBUG: Generates random tiles
 */
function generateRandomTiles() {

  // DEBUG: Generate some random tiles
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
      
      // adds a tile
      var tile = new Datacenter(color, q, r);
    }
  }
  
  // DEBUG: Adds a single tile
  var tile2 = new Datacenter("blue" , 25, 0);

}


/*
 * Draw order sorter
 */
function sortByRow(a, b) {
  var aIndex = 20000 * a.r + 10000 * !(a.q % 2 == 0) + a.q; // trivial
  var bIndex = 20000 * b.r + 10000 * !(b.q % 2 == 0) + b.q; // easy, isn't it?

  if (aIndex < bIndex) return -1;
  if (aIndex > bIndex) return 1;
  return 0;
}


/*
 * Can be used to animate a tile
 */
function oscillate(e) {
  _.each(this.children, function (e) { 
    e.y = -( Math.sin(createjs.Ticker.getTime() / 500)) * 8;
  });
}


/*
 * Gets called whenever the browser window resizes
 */
function onResize() {
  // fill the viewport
  canvas.width = document.body.clientWidth; 
  canvas.height = document.body.clientHeight; 

  // center camera
  cam.x = canvas.width / 2;
  cam.y = canvas.height / 2;
}

// start the game
init();
