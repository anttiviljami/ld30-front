/**
 * main.js
 */

// variables in global scope
var stage, w, h, loader;
var map;
var maskBounds, dragOrigin;
var mouseIsDown = false;

/*
 * This gets loaded initally
 */
function init() {

  // disable context menu
  document.getElementById('stage').oncontextmenu = function() { return false; };

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


  // grab tile mask bounds
  maskBounds = new createjs.Bitmap(loader.getResult('tile_mask')).getBounds();

  for (var r = 0; r < 12; ++r) {

    for (var q = 0; q < 15; ++q) {
      
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

      tile.on('click', function(e) {
        console.log(e);
        if ( e.nativeEvent.button === 0 ) { 
          console.log(this.q + ", " + this.r);
        }
      });
	
	  tile.on('mousedown', function(e) {
         // this.children[2].gotoAndPlay('circle_dark'); 
      });

	  tile.on('pressup', function(e) {
         // this.children[2].gotoAndPlay('blank');
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
   
  stage.update(event);
}

function onMouseDown(e) {
  //console.log(e);
  if ( e.nativeEvent.button === 2 ) { 
    mouseIsDown = true;
    dragOrigin = {
      x: e.stageX - map.x,
      y: e.stageY - map.y,
    }
  } 
  
}

function onMouseUp(e) {
 // console.log(e);
  mouseIsDown = false;
}

function onMouseMove(e) {
  //console.log(e);
  if(mouseIsDown) {
    map.x = e.stageX - dragOrigin.x;
    map.y = e.stageY - dragOrigin.y;
  }
}

function coordToPoint(coord) {
  
  point = {};
  
  point.x = coord.q * maskBounds.width * 3/4;
  point.y = coord.r * maskBounds.height + (coord.q % 2) * maskBounds.height / 2;

  return point;
}

init();

