function Datacenter(e,t,a,r){if(null==getTile(e,t)){tiles[e]||(tiles[e]={}),tiles[e][t]=this;var o=new createjs.Container,i=teams[r];"undefined"==typeof i&&(i="grey"),o.colour=i,o.q=e,o.r=t;var n=new createjs.Container,d=new createjs.Bitmap(loader.getResult("tile_"+i)),l=new createjs.Bitmap(loader.getResult(a+"_"+i));switch(a){case"server":l.x=7,l.y=-125;break;case"dome":l.x=8,l.y=-16;break;case"factory":l.x=10,l.y=-80}var s=new createjs.Sprite(new createjs.SpriteSheet(loader.getResult("transfer_data")),"blank");s.y-=30,n.addChild(d),n.addChild(s),n.addChild(l),o.addChild(n);var c=coordToPoint({q:e,r:t});return o.x=c.x,o.y=c.y,o.hitArea=new createjs.Bitmap(loader.getResult("tile_mask")),o.on("rollover",function(){this.children[0].y=-14}),o.on("rollout",function(){this.children[0].y=0}),o.on("click",function(e){0===e.nativeEvent.button&&console.log(this)}),map.addChild(o),sortDraw=!0,this}}function PathNode(e,t,a,r){if(null==getTile(e,t)){plates[e]||(plates[e]={}),plates[e][t]=this;var o=teams[a];"undefined"==typeof o&&(o="grey"),pathNode=new createjs.Container,pathNode.addChild(new createjs.Bitmap(loader.getResult("tile_"+o))),pathNode.q=e,pathNode.r=t,pathNode.colour=o;var i=coordToPoint({q:e,r:t});return pathNode.x=i.x,pathNode.y=i.y,map.addChild(pathNode),sortDraw=!0,this}}