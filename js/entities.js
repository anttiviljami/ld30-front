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
function Datacenter(colour, q, r) {

  // save into the global tiles collection
  if(!tiles[q]) {
    tiles[q] = {};
  }
  tiles[q][r] = this;
  
  // create the tile container
  var tile = new createjs.Container();

  // retain the coordinate and the colour
  tile.colour = colour;
  tile.q = q;
  tile.r = r;

  // create a container for the composite sprites
  var tileSpriteContainer = new createjs.Container();
  
  // create base sprite 
  var tileSprite = new createjs.Bitmap(loader.getResult("tile_" + colour));
    
  // create random structure sprite
  var tileStructureSprite;
  var rand = Math.round(Math.random() * 2);
  switch(rand) {
    case 0:
      tileStructureSprite = new createjs.Bitmap(loader.getResult("server_" + colour));
      tileStructureSprite.x = 32;
      tileStructureSprite.y = -48;
      break;
    case 1:
      tileStructureSprite = new createjs.Bitmap(loader.getResult("dome_" + colour));
      tileStructureSprite.x = 26;
      tileStructureSprite.y = 2;
       break;
    case 2:
      tileStructureSprite = new createjs.Bitmap(loader.getResult("factory_" + colour));
      tileStructureSprite.x = 25;
      tileStructureSprite.y = -44;
      break;  
  }

  // add the sprites into sprite container
  tileSpriteContainer.addChild(tileSprite);
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
