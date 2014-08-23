/**
 * main.js
 */

// variables in global scope
var stage, w, h, loader;
var map;
var maskBounds, dragOrigin;
var dragging = drawing = false;
var connectionPath;

var tiles = {};

/*
 * This gets loaded initally
 */
function init() {

  // disable context menu
  document.getElementById('stage').oncontextmenu = function() { return false; };

  // manifest 
  var manifest = [
    {src:'assets/tile_mask.png', id:'tile_mask'},
    {src:'assets/blue/tile_blue_data.json', id:'tile_blue_data'},
    {src:'assets/gray/tile_gray_data.json', id:'tile_gray_data'},
    {src:'assets/red/tile_red_data.json', id:'tile_red_data'},
    {src:'assets/yellow/tile_yellow_data.json', id:'tile_yellow_data'},
    {src:'assets/animations/pulsate.json', id:'pulsate_data'},
    {src:'assets/animations/pulsate_reverse.json', id:'pulsate_reverse_data'},
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

  // the game world
  map = new createjs.Container();
  stage.addChild(map);

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


  // create a tile grid overlay to for pixel conversions
  for (var r = 0; r < 12; ++r) {
    for (var q = 0; q < 15; ++q) {
    
      var tile = new Tile(q, r, 'tile_yellow');

      tile.on('rollover', function() {
        //this.children[0].gotoAndPlay('circle');
        this.children[1].gotoAndPlay('pulsate');
      });

      tile.on('rollout', function() {
        //this.children[0].gotoAndPlay('tile_empty');
        this.children[1].gotoAndPlay('pulsate_empty');
      });

      tile.on('click', function(e) {
        if ( e.nativeEvent.button === 0 ) { 
          //console.log(this.q + ", " + this.r)
        }
      });

    }
  }

  // set timing mode
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', onTick);

}

function onTick(event) {
  //console.log('tick');
   
  stage.update(event);
}

function onMouseDown(e) {
  //console.log(e);

  var worldPoint = map.globalToLocal(e.stageX, e.stageY);

  if ( e.nativeEvent.button === 0 ) { 
    drawing = true;
    connectionPath = [ JSON.stringify(pointToCoord(worldPoint)) ];
  } 

  if ( e.nativeEvent.button === 2 ) { 
    dragging = true;
    dragOrigin = worldPoint;
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
  var currentCoord = pointToCoord(worldPoint);
  var currentTile = getTile(currentCoord.q, currentCoord.r);

  console.log(currentTile);
  if(!currentTile) {
    console.log('empty');
  }
  

  if(drawing) {
    if(!_.contains(connectionPath, JSON.stringify(currentCoord))) {
      connectionPath.push(JSON.stringify(currentCoord));
    };
  }

  if(dragging) {
    map.x = e.stageX - dragOrigin.x;
    map.y = e.stageY - dragOrigin.y;
  }
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

init();

