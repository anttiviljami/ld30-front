/**
 * entities.js
 */

// add animated tile
function Datacenter(color, q, r) {
  
  // create the tile container
  tile = new createjs.Container();
  tileContainer = new createjs.Container();

  // save into multi-dimensional array

  if(!tiles[q]) {
    tiles[q] = {};
  }

  tiles[q][r] = this;
  
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

  // retain the coordinate
  tileClone.q = q;
  tileClone.r = r;

  // add a transparent hitbox
  tileClone.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

  // show the hitArea
  //tileClone.addChild(tileClone.hitArea);

  
  map.addChild(tileClone);

  // fix draw order 
  sortDraw = true;

  return tileClone;
}
