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

  // manifest 
  var manifest = [
    {src:'assets/tile_mask.png', id:'tile_mask'},
    {src:'assets/tile_blue.png', id:'tile_blue'},
    {src:'assets/tile_blue.json', id:'tile_blue_data'},
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
  maskBounds = {
    width: 90,
    height: 35.5
  };

  // add animated tile
  var tileSprite = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult('tile_blue_data')), 
    'blue_tile'
  );

  for (var y = 0; y < 12; ++y) {

    for (var x = 0; x < 6; ++x) {
    
      var tileClone = new Tile(tileSprite);

      tileClone.x = x * maskBounds.width * 2 + (y % 2) *  maskBounds.width;
      tileClone.y = y * maskBounds.height;

      tileClone.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

      map.addChild(tileClone);  

      tileClone.on('rollover', function() {
        this.children[0].gotoAndPlay('pulsate');
      });

       tileClone.on('rollout', function() {
        this.children[0].gotoAndPlay('blue_tile');
      });

    }

  }

  createjs.Ticker.addEventListener('tick', onTick);

}

function onTick(event) {
  //console.log('tick');
   
  stage.update(event);
}


function Tile(sprite) {
  
  // create the tile container
  tile = new createjs.Container();
  
  // add the sprite
  tile.sprite = tile.addChild(sprite);

  // add a transparent hitbox

  return tile.clone(true);
}

function onMouseDown(e) {
  //console.log(e);
  mouseIsDown = true;
  dragOrigin = {
    x: e.stageX - map.x,
    y: e.stageY - map.y,
  }
}

function onMouseUp(e) {
 // console.log(e);
  mouseIsDown = false;
}

function onMouseMove(e) {
  //console.log(e);
  if(mouseIsDown) {
    console.log(map.getBounds());
    map.x = e.stageX - dragOrigin.x;
    map.y = e.stageY - dragOrigin.y;
  }
}

init();

