function init(){var e=[{src:"assets/menu/choose.png",id:"logo"},{src:"assets/menu/tile_blue_fancy.png",id:"tile_blue_fancy"},{src:"assets/menu/tile_red_fancy.png",id:"tile_red_fancy"},{src:"assets/menu/tile_yellow_fancy.png",id:"tile_yellow_fancy"},{src:"assets/tile_mask.png",id:"tile_mask"},{src:"assets/blue/tile_blue.png",id:"tile_blue"},{src:"assets/blue/server_blue.png",id:"server_blue"},{src:"assets/blue/dome_blue.png",id:"dome_blue"},{src:"assets/blue/factory_blue.png",id:"factory_blue"},{src:"assets/red/tile_red.png",id:"tile_red"},{src:"assets/red/server_red.png",id:"server_red"},{src:"assets/red/dome_red.png",id:"dome_red"},{src:"assets/red/factory_red.png",id:"factory_red"},{src:"assets/yellow/tile_yellow.png",id:"tile_yellow"},{src:"assets/yellow/server_yellow.png",id:"server_yellow"},{src:"assets/yellow/dome_yellow.png",id:"dome_yellow"},{src:"assets/yellow/factory_yellow.png",id:"factory_yellow"},{src:"assets/grey/tile_grey.png",id:"tile_grey"},{src:"assets/grey/server_grey.png",id:"server_grey"},{src:"assets/grey/dome_grey.png",id:"dome_grey"},{src:"assets/grey/factory_grey.png",id:"factory_grey"},{src:"assets/tile_empty.png",id:"tile_empty"},{src:"assets/animations/pulsate.json",id:"pulsate_data"},{src:"assets/animations/pulsate_reverse.json",id:"pulsate_reverse_data"},{src:"assets/animations/circle_dark.json",id:"circle_dark_data"},{src:"assets/animations/transfer.json",id:"transfer_data"},{src:"assets/animations/fancy_tile_pulsate.json",id:"fancy_tile_pulsate_data"},{src:"assets/animations/menu_ch_pulsate.json",id:"menu_ch_pulsate_data"},{src:"assets/animations/menu_oo_pulsate.json",id:"menu_oo_pulsate_data"},{src:"assets/animations/menu_se_pulsate.json",id:"menu_se_pulsate_data"},{src:"assets/animations/dome_flash.json",id:"dome_flash_data"},{src:"assets/animations/factory_smoke.json",id:"factory_smoke_data"}];server=new Server,server.init(),loader=new createjs.LoadQueue(!1),loader.addEventListener("complete",gameInit),loader.loadManifest(e)}function gameInit(){canvas=document.getElementById("stage"),canvas.oncontextmenu=function(){return!1},stage=new createjs.Stage("stage"),createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED,createjs.Ticker.setFPS(60),createjs.Ticker.addEventListener("tick",onTick),window.addEventListener("resize",onResize),onResize(),startConnections(),mainMenu()}function mainMenu(){menu=new createjs.Container,stage.addChild(menu);var e=new createjs.Container,t=new createjs.Bitmap(loader.getResult("logo")),a=new createjs.Sprite(new createjs.SpriteSheet(loader.getResult("menu_ch_pulsate_data")),"blank"),n=new createjs.Sprite(new createjs.SpriteSheet(loader.getResult("menu_oo_pulsate_data")),"blank"),s=new createjs.Sprite(new createjs.SpriteSheet(loader.getResult("menu_se_pulsate_data")),"blank");e.addChild(t),e.addChild(a,n,s),console.log(e.getChildIndex(a)+", "+e.getChildIndex(n)),a.x=-640,n.x=-140,s.x=390,t.x=-t.getBounds().width/2,e.x=canvas.width/2,e.y=1*canvas.height/4,e.scaleX=e.scaleY=.5,e.on("tick",oscillate);var r=-1;_.each(teams,function(t,a){var n=new createjs.Container,s=new createjs.Bitmap(loader.getResult("tile_"+t+"_fancy")),o=new createjs.Sprite(new createjs.SpriteSheet(loader.getResult("fancy_tile_pulsate_data")),"blank");o.x=s.x=-s.getBounds().width/2,n.addChild(s),n.addChild(o),console.log(r),n.scaleX=n.scaleY=.5,n.x=canvas.width/2+r*n.getBounds().width,n.y=2*canvas.height/3,n.on("click",function(){server.login(a),stage.removeChild(menu),startGame()}),n.i=r,console.log(e.children),n.on("rollover",function(){var t=["ch","oo","se"];e.children[this.i+2].gotoAndPlay("menu_"+t[this.i+1]+"_pulsate"),this.children[1].gotoAndPlay("fancy_tile_pulsate")}),n.on("rollout",function(){e.children[this.i+2].gotoAndStop(0),this.children[1].gotoAndStop(0)}),stage.enableMouseOver(10),n.cursor="pointer",menu.addChild(n),r++}),menu.addChild(e)}function startGame(){if(cam=new createjs.Container,stage.addChild(cam),map=new createjs.Container,cam.addChild(map),cam.scaleX=cam.scaleY=.75,stage.enableMouseOver(),initControls(),maskBounds=new createjs.Bitmap(loader.getResult("tile_mask")).getBounds(),"number"==typeof server.startHex.q){var e=coordToPoint({q:server.startHex.q,r:server.startHex.r});map.x=-e.x,map.y=-e.y}_.each(server.hexes,function(e){var t=new Datacenter(e.q,e.r,e.type,e.owner)}),_.each(server.connections,function(e){new PathNode(e.startQ,e.startR,e.team),new PathNode(e.endQ,e.endR,e.team),_.each(e.route,function(t){new PathNode(t.q,t.r,e.team)})}),sortDraw=!0,onResize()}function startConnections(){_.each(server.teams,function(e){teams[e.id]=e.color}),dpd.on("hex:create",function(e){var t=new Audio("assets/CashRegister.mp3");t.play()}),dpd.on("hex:updated",function(e){var t=new Audio("assets/CashRegister.mp3");t.play()}),dpd.on("connection:created",function(e){new PathNode(e.startQ,e.startR,e.team),new PathNode(e.endQ,e.endR,e.team),_.each(e.route,function(t){new PathNode(t.q,t.r,e.team)})}),dpd.on("connection:updated",function(e){var t=new Audio("assets/CashRegister.mp3");t.play()}),dpd.on("game:started",function(e){var t=new Audio("assets/CashRegister.mp3");t.play()})}function onTick(e){sortDraw&&map&&(map.sortChildren(sortByRow),map.sortChildren(sortByRow),sortDraw=!1),stage.update(e)}function getTile(e,t){return tiles[e]?tiles[e][t]:null}function coordToPoint(e){return point={},point.x=e.q*maskBounds.width*3/4,point.y=e.r*maskBounds.height+e.q%2*maskBounds.height/2,point}function pointToCoord(e){coord={},coord.q=Math.floor(e.x/(3*maskBounds.width/4)),coord.r=Math.floor(e.y/maskBounds.height);for(var t=-1;1>=t;++t)for(var a=0;a>=-1;--a){var n=new createjs.Bitmap(loader.getResult("tile_mask")),s={q:coord.q+a,r:coord.r+t},r=coordToPoint(s);if(n.x=r.x,n.y=r.y,map.addChild(n),n.on("rollover",function(){}),_.contains(map.getObjectsUnderPoint(e.x,e.y),n))return map.removeChild(n),s;map.removeChild(n)}}function distance(e,t){return"object"!=typeof e||"object"!=typeof t?0:Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function normalize(e){if("object"!=typeof e)return 0;var t=distance(e,{x:0,y:0});return{x:e.x/t,y:e.y/t}}function PointerTile(e,t){pointerTile=new createjs.Container,pointerTile.addChild(new createjs.Bitmap(loader.getResult("tile_empty"))),pointerTile.q=e,pointerTile.r=t;var a=coordToPoint({q:e,r:t});return pointerTile.x=a.x,pointerTile.y=a.y,pointerTile.alpha=.4,map.addChild(pointerTile),sortDraw=!0,this}function generateRandomTiles(){for(var e=0;12>e;++e)for(var t=1;15>t;++t){var a,n=Math.round(4*Math.random());switch(n){case 0:a="server";break;case 1:a="dome";break;case 2:a="factory"}var s=new Datacenter(t,e,a)}}function sortByRow(e,t){var a=2e4*e.r+1e4*!(e.q%2==0)+e.q+e.id,n=2e4*t.r+1e4*!(t.q%2==0)+t.q+t.id;return n>a?-1:a>n?1:0}function oscillate(e){_.each(this.children,function(e){e.y=8*-Math.sin(createjs.Ticker.getTime()/500)})}function pathFind(e,t){for(var a=[],n=e;JSON.stringify(n)!=JSON.stringify(t);)a.push(n),n=neighbours(n).sort(function(e,a){return distance(coordToPoint(e),coordToPoint(t))<distance(coordToPoint(a),coordToPoint(t))?-1:distance(coordToPoint(e),coordToPoint(t))>distance(coordToPoint(a),coordToPoint(t))?1:0})[0];return a.push(t),a}function neighbours(e){var t=[[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[0,1]],[[1,1],[1,0],[0,-1],[-1,0],[-1,1],[0,1]]],a=_.map(t[e.q%2!=0?1:0],function(t){return{q:e.q+t[0],r:e.r+t[1]}});return a}function onResize(){canvas.width=document.body.clientWidth,canvas.height=document.body.clientHeight,"object"==typeof camera&&(cam.x=canvas.width/2,cam.y=canvas.height/2)}function fadeOut(e){createjs.Tween.get(e).to({alpha:0},1e3).call(function(){})}var stage,canvas,loader,menu,cam,map,maskBounds,dragOrigin,currentTile,currentPoint,currentCoord,prevCoord,connectionPath,pointerTile,drawing=dragging=!1,sortDraw=!0,server={},tiles={},teams={},team;init();