/**
 * Filename: main.js
 * Project: Ludum Dare 30 Entry
 * Copyright: (c) 2014 Ludum Dare Team Tampere
 * License: The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * Main logic for the game
 */


// main game objects
var stage, canvas, loader, menu;

// camera and game world container
var cam, map;

// miscellaneous
var maskBounds, dragOrigin, currentTile, currentPoint, currentCoord, prevCoord, 
    connectionPath, pointerTile;

// control state flags
var drawing = dragging = false;

// controls whether to recalculate draw order
var sortDraw = true;

// backend data sync
var server = {};

// a multi-dimensional collection of game tiles
var tiles = {};

var teams = {};

var team;


/*
 * Entry point, gets called on game start
 */
function init() {
  var manifest = [

    // menu
    {src:'assets/menu/choose.png', id:'logo'},
    {src:'assets/menu/tile_blue_fancy.png', id:'tile_blue_fancy'},
    {src:'assets/menu/tile_red_fancy.png', id:'tile_red_fancy'},
    {src:'assets/menu/tile_yellow_fancy.png', id:'tile_yellow_fancy'},

    // hex tile shape and dimensions
    {src:'assets/tile_mask.png', id:'tile_mask'},
      
    // spritesheets
    {src:'assets/blue/tile_blue.png', id:'tile_blue'},
    {src:'assets/blue/server_blue.png', id:'server_blue'},
    {src:'assets/blue/dome_blue.png', id:'dome_blue'},
    {src:'assets/blue/factory_blue.png', id:'factory_blue'},

    {src:'assets/red/tile_red.png', id:'tile_red'},
    {src:'assets/red/server_red.png', id:'server_red'},
    {src:'assets/red/dome_red.png', id:'dome_red'},
    {src:'assets/red/factory_red.png', id:'factory_red'},

    {src:'assets/yellow/tile_yellow.png', id:'tile_yellow'},
    {src:'assets/yellow/server_yellow.png', id:'server_yellow'},
    {src:'assets/yellow/dome_yellow.png', id:'dome_yellow'},
    {src:'assets/yellow/factory_yellow.png', id:'factory_yellow'},
    
    {src:'assets/grey/tile_grey.png', id:'tile_grey'},
    {src:'assets/grey/server_grey.png', id:'server_grey'},
    {src:'assets/grey/dome_grey.png', id:'dome_grey'},
    {src:'assets/grey/factory_grey.png', id:'factory_grey'},
    
    {src:'assets/tile_empty.png', id:'tile_empty'},
      
    // animations
    {src:'assets/animations/pulsate.json', id:'pulsate_data'},
    {src:'assets/animations/pulsate_reverse.json', id:'pulsate_reverse_data'},
    {src:'assets/animations/circle_dark.json', id:'circle_dark_data'},
    {src:'assets/animations/transfer.json', id:'transfer_data'},

    {src:'assets/animations/fancy_tile_pulsate.json', id:'fancy_tile_pulsate_data'},
    {src:'assets/animations/menu_ch_pulsate.json', id:'menu_ch_pulsate_data'},
    {src:'assets/animations/menu_oo_pulsate.json', id:'menu_oo_pulsate_data'},
    {src:'assets/animations/menu_se_pulsate.json', id:'menu_se_pulsate_data'},
      
    // structure animations
    {src:'assets/animations/dome_flash.json', id:'dome_flash_data'},
    {src:'assets/animations/factory_smoke.json', id:'factory_smoke_data'},
    {src:'assets/animations/server_flash.json', id:'server_flash_data'},
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

  // canvas should fill the browser window
  window.addEventListener('resize', onResize);
  onResize();

  startConnections();

  mainMenu();
  //startGame();

}


/*
 * Displays the main menu
 */
function mainMenu() {

  menu = new createjs.Container();
  stage.addChild(menu);

  var logo = new createjs.Container();
  var logoImg = new createjs.Bitmap(loader.getResult('logo'));

  var ch = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult("menu_ch_pulsate_data")),
      "blank"
  );

  var oo = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult("menu_oo_pulsate_data")),
      "blank"
  );

  var se = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult("menu_se_pulsate_data")),
      "blank"
  );


  logo.addChild(logoImg);
  logo.addChild(ch, oo, se);

  console.log(logo.getChildIndex(ch) + ', ' + logo.getChildIndex(oo) );

  ch.x = -640;
  oo.x = -140;
  se.x = 390;

  logoImg.x = - logoImg.getBounds().width / 2;

  logo.x = canvas.width / 2;
  logo.y = canvas.height * 1 / 4;

  logo.scaleX = logo.scaleY = 0.5;

  logo.on('tick', oscillate);

  var i = -1;
  _.each(teams, function (e, id) {

    var button = new createjs.Container();
    var buttonImg = new createjs.Bitmap(loader.getResult('tile_' + e + '_fancy'));
    var buttonAnimation = new createjs.Sprite(
      new createjs.SpriteSheet(loader.getResult("fancy_tile_pulsate_data")),
      "blank"
    );

    buttonAnimation.x = buttonImg.x = - buttonImg.getBounds().width / 2;

    button.addChild(buttonImg);
    button.addChild(buttonAnimation);

    console.log(i);

    button.scaleX = button.scaleY = 0.5;

    button.x = canvas.width / 2 + i * button.getBounds().width;
    button.y = canvas.height * 2 / 3;

    button.on('click', function () {
      server.login(id);
      stage.removeChild(menu);
      startGame();
    }); 

    button.i = i;

    console.log(logo.children);

    button.on('rollover', function() {
      var anims = ["ch", "oo", "se"];
      logo.children[this.i + 2].gotoAndPlay('menu_'+ anims[this.i + 1] +'_pulsate');
      this.children[1].gotoAndPlay('fancy_tile_pulsate');
    });

    button.on('rollout', function() {
      logo.children[this.i + 2].gotoAndStop(0);
      this.children[1].gotoAndStop(0);
    });

    stage.enableMouseOver(10);
    button.cursor = 'pointer';

    menu.addChild(button);

    i++;

  });

  /*for (var i = 0; i < logos.length) {

  }*/

  

  menu.addChild(logo);

}


/*
 * Starts the game
 */
function startGame() {

  // the game camera
  cam = new createjs.Container(); 
  stage.addChild(cam);

  // the game world
  map = new createjs.Container();
  cam.addChild(map);

  // initial scale is 50%
  cam.scaleX = cam.scaleY = .75;

  // enable some mouse events
  stage.enableMouseOver();

  // set up global mouse events
  initControls();

  // grab tile mask bounds for later use
  maskBounds = new createjs.Bitmap(loader.getResult('tile_mask')).getBounds();

  // DEBUG: Generate some random tiles
  //generateRandomTiles();

  //TODO: add overlay login screen
  //console.log(server.teams);
  //server.login();

  // get your team id and login
  //team = server.user.team;

  if(typeof server.startHex.q === 'number') {
    //player is logged in
    var home = coordToPoint({q: server.startHex.q, r: server.startHex.r});
    map.x = -home.x;
    map.y = -home.y;
  }

  _.each(server.hexes, function(e) {
    var tile = new Datacenter(e.q, e.r, e.type, e.owner);
  });

  _.each(server.connections, function(e) {
    // render endpoints
    new PathNode(e.startQ, e.startR, e.team);
    new PathNode(e.endQ, e.endR, e.team);

    _.each(e.route, function(p) {
      new PathNode(p.q, p.r, e.team);
    });
  });

  sortDraw = true; // recalculate draw order

  onResize();
}


function startConnections() { 

  // load available teams
  _.each(server.teams, function(e) { teams[e.id] = e.color; });

  // listen to events from websocket
  dpd.on('hex:create', function(e) {
    var sfx = new Audio('assets/CashRegister.mp3');
    sfx.play();
  });

  dpd.on('hex:updated', function(e) {
    var sfx = new Audio('assets/CashRegister.mp3');
    sfx.play();
  });

  dpd.on('connection:created', function(e) {
    // render endpoints
    new PathNode(e.startQ, e.startR, e.team);
    new PathNode(e.endQ, e.endR, e.team);

    _.each(e.route, function(p) {
      new PathNode(p.q, p.r, e.team);
    });
  });

  dpd.on('connection:updated', function(e) {
    var sfx = new Audio('assets/CashRegister.mp3');
    sfx.play();
  });

  dpd.on('game:started', function(e) {
    var sfx = new Audio('assets/CashRegister.mp3');
    sfx.play();
  });

}


/*
 * Tick handler
 */
function onTick(e) {
  
  if(sortDraw && map) {
    // recalculate the draw order
    map.sortChildren(sortByRow);
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
    for (var q = 0; q >= -1; --q) { 
      
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
 * Returns the distance between two points
 */
function distance(point0, point1) {
  if(typeof point0 != 'object' || typeof point1 != 'object') return 0;
  return Math.sqrt(Math.pow(point0.x - point1.x, 2) + Math.pow(point0.y - point1.y, 2));
}

/*
 * Returns a parallel vector with a length of one
 */
function normalize(point) {
  if(typeof point != 'object') return 0;
  var length = distance(point, {x: 0, y: 0});
  return {x: point.x / length, y: point.y / length};
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
      
      var type;
      var rand = Math.round(Math.random() * 4);
      
      switch(rand) {
        case 0: type = "server";
          break;
        case 1: type = "dome";
          break;
        case 2: type = "factory";
          break;
      }
      
      // adds a tile
      var tile = new Datacenter(q, r, type);
    }
  }
}


/*
 * Draw order sorter
 */
function sortByRow(a, b) {
  var aIndex = 20000 * a.r + 10000 * !(a.q % 2 == 0) + a.q + a.id; // trivial
  var bIndex = 20000 * b.r + 10000 * !(b.q % 2 == 0) + b.q + b.id; // easy, isn't it?

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
 * Returns the shortest path between two coordinates
 */
function pathFind(coord0, coord1) {
  
  var path = [];

  //starting point
  var pathCoord = coord0;

  //we're not done until we get there
  while(JSON.stringify(pathCoord) != JSON.stringify(coord1)) {

    path.push(pathCoord);

    //sort neighbours by distance to target
    pathCoord = neighbours(pathCoord).sort(function (a, b) {
      if(distance(coordToPoint(a), coordToPoint(coord1)) 
        < distance(coordToPoint(b), coordToPoint(coord1))) {
          //a is better
        return -1;
      }
      if(distance(coordToPoint(a), coordToPoint(coord1)) 
        > distance(coordToPoint(b), coordToPoint(coord1))) {
          //b is better
        return 1;
      }
      return 0;
    })[0];

  }

  path.push(coord1);
  return path;
}

/*
 * Returns neighbouring coordinates
 */
function neighbours(coord) {

  var offsets = [
   [ [+1,  0], [+1, -1], [ 0, -1],
     [-1, -1], [-1,  0], [ 0, +1] ],
   [ [+1, +1], [+1,  0], [ 0, -1],
     [-1,  0], [-1, +1], [ 0, +1] ]
]

  var ret = _.map(offsets[!(coord.q % 2 == 0) ? 1 : 0], function(e) {
    return {q: coord.q + e[0], r: coord.r + e[1]};
  });

  return ret;
}

/*
 * Gets called whenever the browser window resizes
 */
function onResize() {
  // fill the viewport
  canvas.width = document.body.clientWidth; 
  canvas.height = document.body.clientHeight; 

  // center camera
  if(typeof camera === 'object') {
    cam.x = canvas.width / 2;
    cam.y = canvas.height / 2;
  }

}


/*
 * Fade out and get rid of something
 */
function fadeOut(target) {
  createjs.Tween.get(target).to({alpha: 0}, 1000).call(function() {

  });
}


// start the game
init();

