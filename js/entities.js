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
  
  // create the tile container
  tile = new createjs.Container();
  tileContainer = new createjs.Container();

  // save into multi-dimensional array

  if(!tiles[q]) {
    tiles[q] = {};
  }

  tiles[q][r] = this;
  
  // add base tile 
  var tileSprite = new createjs.Bitmap(loader.getResult("tile_" + colour));
    
  // add structure
  var tileStructureSprite;
  var rand = Math.round(Math.random() * 2);
  switch(rand) {
      case 0:
          tileStructureSprite = new createjs.Bitmap(loader.getResult("server_" + colour)
          );
          tileStructureSprite.x = 32;
          tileStructureSprite.y = -48;
          break;
      case 1:
          tileStructureSprite = new createjs.Bitmap(loader.getResult("dome_" + colour)
          );
          tileStructureSprite.x = 26;
          tileStructureSprite.y = 2;
          break;
      case 2:
          tileStructureSprite = new createjs.Bitmap(loader.getResult("factory_" + colour)
          );
          tileStructureSprite.x = 25;
          tileStructureSprite.y = -44;
          break;  
  }

  // add the sprite
  tileContainer.sprite = tileContainer.addChild(tileSprite);
  tileContainer.sprite = tileContainer.addChild(tileStructureSprite);
    
  // wrap tileContainer into tile
  tile.addChild(tileContainer);

  // add a transparent hitbox
  tileClone = tile.clone(true);

  // position
  var position = coordToPoint({q: q, r: r});

  tileClone.x = position.x;
  tileClone.y = position.y;

  // retain the coordinate and the colour
  tileClone.colour = colour;
  tileClone.q = q;
  tileClone.r = r;

  // add a transparent hitbox
  tileClone.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

  // display the hitArea
  //tileClone.addChild(tileClone.hitArea);

  // set up mouse events
  tileClone.on('rollover', function() {
    this.children[0].y = -11;
  });
  tileClone.on('rollout', function() {
    this.children[0].y = 0;
  });
  tileClone.on('click', function(e) {
    if ( e.nativeEvent.button === 0 ) { 
      console.log(this);
    }
  });

  map.addChild(tileClone);

  // fix draw order 
  sortDraw = true;

  return tileClone;
}
