/**
 * Filename: entities.js
 * Project: Ludum Dare 30 Entry
 * Copyright: (c) 2014 Ludum Dare Team Tampere
 * License: The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * Game entities that can be spawned in the game world
 */


/*
 * Adds a Datacenter node of a certain colour
 */
function Datacenter(q, r, type, owner) {

  // save into the global tiles collection
  if(!tiles[q]) {
    tiles[q] = {};
  }
  tiles[q][r] = this;
  
  // create the tile container
  var tile = new createjs.Container();
  
  var colour = teams[owner]; // colour can be fetched from teams 
  if(typeof colour === 'undefined') {
    colour = 'gray'; //grey
  }

  //console.log(type+"_"+colour)

  // retain the coordinate and the colour
  tile.colour = colour;
  tile.q = q;
  tile.r = r;

  // create a container for the composite sprites
  var tileSpriteContainer = new createjs.Container();
  
  // create base sprite 
  var tileSprite = new createjs.Bitmap(loader.getResult("tile_" + colour));
    
  // create random structure sprite
  var tileStructureSprite = new createjs.Bitmap(loader.getResult(type + '_' + colour));
  switch(type) {
    case 'server':
      tileStructureSprite.x = 32;
      tileStructureSprite.y = -48;
      break;
    case 'dome':
      tileStructureSprite.x = 26;
      tileStructureSprite.y = 2;
      break;
    case 'factory':
      tileStructureSprite.x = 25;
      tileStructureSprite.y = -44;
      break;  
  }
    
  // create transfer animation
  var tileTransferAnimation = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult("transfer_data")),
      "blank"
  );

  tileTransferAnimation.y -= 30;

  // add the sprites into sprite container
  tileSpriteContainer.addChild(tileSprite);
  tileSpriteContainer.addChild(tileTransferAnimation);
  tileSpriteContainer.addChild(tileStructureSprite);
    
  // add tileSpriteContainer into tile itself
  tile.addChild(tileSpriteContainer);

  // position
  var position = coordToPoint({q: q, r: r});
  tile.x = position.x;
  tile.y = position.y;

  // load a separate hitArea
  tile.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

  // display the hitArea
  //tile.addChild(tile.hitArea);

  // set up mouse events
  tile.on('rollover', function() {
    this.children[0].y = -14;
  });
  tile.on('rollout', function() {
    this.children[0].y = 0;
  });
  tile.on('click', function(e) {
    if ( e.nativeEvent.button === 0 ) { 
      console.log(this);
    }
  });

  // add to game world
  map.addChild(tile);

  // fix draw order 
  sortDraw = true;

  // return the itself
  return this;
}

/*
 * Creates a single Path Node that represents data flow
 */
function PathNode(q, r, owner, phase) {
  
  var colour = teams[owner]; // colour can be fetched from teams 
  if(typeof colour === 'undefined') {
    colour = 'gray'; //grey
  }

  pathNode = new createjs.Container();
  pathNode.addChild(new createjs.Bitmap(loader.getResult('tile_' + colour)));

  // save coordinates
  pathNode.q = q;
  pathNode.r = r;

  // position the block
  var pos = coordToPoint({q: q, r: r});
  pathNode.x = pos.x;
  pathNode.y = pos.y;
  
  //pathNode.alpha = .4; // transparency

  map.addChild(pathNode);
  sortDraw = true; // recalculate draw order

  return this;
}

