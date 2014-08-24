function init(){var e=[{src:"assets/tile_mask.png",id:"tile_mask"},{src:"assets/blue/tile_blue.png",id:"tile_blue"},{src:"assets/blue/server_blue_v2.png",id:"server_blue"},{src:"assets/blue/dome_blue.png",id:"dome_blue"},{src:"assets/blue/factory_blue.png",id:"factory_blue"},{src:"assets/red/tile_red.png",id:"tile_red"},{src:"assets/red/server_red_v2.png",id:"server_red"},{src:"assets/red/dome_red.png",id:"dome_red"},{src:"assets/red/factory_red.png",id:"factory_red"},{src:"assets/yellow/tile_yellow.png",id:"tile_yellow"},{src:"assets/yellow/server_yellow_v2.png",id:"server_yellow"},{src:"assets/yellow/dome_yellow.png",id:"dome_yellow"},{src:"assets/yellow/factory_yellow.png",id:"factory_yellow"},{src:"assets/gray/tile_gray.png",id:"tile_gray"},{src:"assets/gray/server_gray_v2.png",id:"server_gray"},{src:"assets/gray/dome_gray.png",id:"dome_gray"},{src:"assets/gray/factory_gray.png",id:"factory_gray"},{src:"assets/tile_empty.png",id:"tile_empty"},{src:"assets/animations/pulsate.json",id:"pulsate_data"},{src:"assets/animations/pulsate_reverse.json",id:"pulsate_reverse_data"},{src:"assets/animations/circle_dark.json",id:"circle_dark_data"}];server=new Server,server.init(),loader=new createjs.LoadQueue(!1),loader.addEventListener("complete",gameInit),loader.loadManifest(e)}function gameInit(){canvas=document.getElementById("stage"),canvas.oncontextmenu=function(){return!1},stage=new createjs.Stage("stage"),createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED,createjs.Ticker.setFPS(60),createjs.Ticker.addEventListener("tick",onTick),cam=new createjs.Container,stage.addChild(cam),map=new createjs.Container,cam.addChild(map),window.addEventListener("resize",onResize),onResize(),cam.scaleX=cam.scaleY=.5,stage.enableMouseOver(),initControls(),maskBounds=new createjs.Bitmap(loader.getResult("tile_mask")).getBounds(),_.each(server.teams,function(e){teams[e.id]=e.color}),team=server.user.team,_.each(server.hexes,function(e){var r=new Datacenter(e.q,e.r,e.type,e.owner);console.log(e)}),sortDraw=!0,dpd.on("hex:create",function(e){console.log(e);var r=new Audio("assets/CashRegister.mp3");r.play()}),dpd.on("hex:updated",function(e){console.log(e);var r=new Audio("assets/CashRegister.mp3");r.play()}),dpd.on("connection:created",function(e){console.log(e);var r=new Audio("assets/CashRegister.mp3");r.play()}),dpd.on("connection:updated",function(e){console.log(e);var r=new Audio("assets/CashRegister.mp3");r.play()})}function onTick(e){sortDraw&&(map.sortChildren(sortByRow),sortDraw=!1),stage.update(e)}function getTile(e,r){return tiles[e]?tiles[e][r]:null}function coordToPoint(e){return point={},point.x=e.q*maskBounds.width*3/4,point.y=e.r*maskBounds.height+e.q%2*maskBounds.height/2,point}function pointToCoord(e){coord={},coord.q=Math.floor(e.x/(3*maskBounds.width/4)),coord.r=Math.floor(e.y/maskBounds.height);for(var r=-1;1>=r;++r)for(var t=0;t>=-1;--t){var o=new createjs.Bitmap(loader.getResult("tile_mask")),a={q:coord.q+t,r:coord.r+r},s=coordToPoint(a);if(o.x=s.x,o.y=s.y,map.addChild(o),o.on("rollover",function(){}),_.contains(map.getObjectsUnderPoint(e.x,e.y),o))return map.removeChild(o),a;map.removeChild(o)}}function distance(e,r){return"object"!=typeof e||"object"!=typeof r?0:Math.sqrt(Math.pow(e.x-r.x,2)+Math.pow(e.y-r.y,2))}function normalize(e){if("object"!=typeof e)return 0;var r=distance(e,{x:0,y:0});return{x:e.x/r,y:e.y/r}}function PointerTile(e,r){pointerTile=new createjs.Container,pointerTile.addChild(new createjs.Bitmap(loader.getResult("tile_empty"))),pointerTile.q=e,pointerTile.r=r;var t=coordToPoint({q:e,r:r});return pointerTile.x=t.x,pointerTile.y=t.y,pointerTile.alpha=.4,map.addChild(pointerTile),sortDraw=!0,this}function generateRandomTiles(){for(var e=0;12>e;++e)for(var r=1;15>r;++r){var t,o=Math.round(4*Math.random());switch(o){case 0:t="server";break;case 1:t="dome";break;case 2:t="factory"}var a=new Datacenter(r,e,t)}}function sortByRow(e,r){var t=2e4*e.r+1e4*!(e.q%2==0)+e.q,o=2e4*r.r+1e4*!(r.q%2==0)+r.q;return o>t?-1:t>o?1:0}function oscillate(e){_.each(this.children,function(e){e.y=8*-Math.sin(createjs.Ticker.getTime()/500)})}function pathFind(e,r){for(var t=[],o=e;JSON.stringify(o)!=JSON.stringify(r);)t.push(o),o=neighbours(o).sort(function(e,t){return distance(coordToPoint(e),coordToPoint(r))<distance(coordToPoint(t),coordToPoint(r))?-1:distance(coordToPoint(e),coordToPoint(r))>distance(coordToPoint(t),coordToPoint(r))?1:0})[0];return t.push(r),t}function neighbours(e){var r=[[[1,0],[1,0],[0,-1],[-1,0],[-1,0],[0,1]],[[1,0],[1,0],[0,-1],[-1,0],[-1,0],[0,1]]],t=_.map(r[e.q%2==0?1:0],function(r){return{q:e.q+r[0],r:e.r+r[1]}});return t}function onResize(){canvas.width=document.body.clientWidth,canvas.height=document.body.clientHeight,cam.x=canvas.width/2,cam.y=canvas.height/2}var stage,canvas,loader,cam,map,maskBounds,dragOrigin,currentTile,currentPoint,currentCoord,prevCoord,connectionPath,pointerTile,drawing=dragging=!1,sortDraw=!0,server={},tiles={},teams={},team;init();