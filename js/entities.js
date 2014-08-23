/**
 * entities.js
 */

// add animated tile
function Tile(q, r) {
  
  // create the tile container
  tile = new createjs.Container();
  
  var tileSprite = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult('tile_empty_data')), 
    'tile_empty'
  );

  // add the sprite
  tile.sprite = tile.addChild(tileSprite);

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