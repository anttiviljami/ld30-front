/**
 * entities.js
 */

// add animated tile
function Datacenter(color, q, r) {
  
  // create the tile container
  tile = new createjs.Container();
  
    
  // add base tile 
  var tileSprite = new createjs.Bitmap(loader.getResult("tile_" + color));
    
  // add structure
  var tileStructureSprite;
  var rand = Math.round(Math.random());
  if(rand == 0) {
      tileStructureSprite = new createjs.Bitmap(loader.getResult("server_" + color)
      );
      tileStructureSprite.x = 32;
      tileStructureSprite.y = -48;
  }
  else {
      tileStructureSprite = new createjs.Bitmap(loader.getResult("dome_" + color)
      );
      tileStructureSprite.x = 26;
      tileStructureSprite.y = 2;
  }

  // add the sprite
  tile.sprite = tile.addChild(tileSprite);
  tile.sprite = tile.addChild(tileStructureSprite);

  // add a transparent hitbox
  tileClone = tile.clone(true);

  // position
  var position = coordToPoint({q: q, r: r});

  tileClone.x = position.x;
  tileClone.y = position.y;

  // retain the coordinate
  tileClone.q = q;
  tileClone.r = r;

  tileClone.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

  // show the hitArea
  //tileClone.addChild(tileClone.hitArea);

  
  map.addChild(tileClone);

  // fix draw order 
  map.setChildIndex(tileClone, map.getChildIndex(tileClone) - !(q % 2));

  return tileClone;
}
