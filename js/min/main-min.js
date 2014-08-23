function init(){document.getElementById("stage").oncontextmenu=function(){return!1};var e=[{src:"assets/tile_mask.png",id:"tile_mask"},{src:"assets/blue/tile_blue_data.json",id:"tile_blue_data"},{src:"assets/gray/tile_gray_data.json",id:"tile_gray_data"},{src:"assets/red/tile_red_data.json",id:"tile_red_data"},{src:"assets/yellow/tile_yellow_data.json",id:"tile_yellow_data"},{src:"assets/animations/pulsate.json",id:"pulsate_data"},{src:"assets/animations/pulsate_reverse.json",id:"pulsate_reverse_data"}];loader=new createjs.LoadQueue(!1),loader.addEventListener("complete",onLoad),loader.loadManifest(e)}function onLoad(){stage=new createjs.Stage("stage"),map=new createjs.Container,stage.addChild(map),stage.enableMouseOver(),w=stage.canvas.width,h=stage.canvas.height,stage.addEventListener("stagemousedown",onMouseDown),stage.addEventListener("stagemouseup",onMouseUp),stage.addEventListener("stagemousemove",onMouseMove),maskBounds=new createjs.Bitmap(loader.getResult("tile_mask")).getBounds();for(var e=0;12>e;++e)for(var t=0;15>t;++t){var o=new Tile(t,e,"tile_yellow");o.on("rollover",function(){this.children[1].gotoAndPlay("pulsate")}),o.on("rollout",function(){this.children[1].gotoAndPlay("pulsate_empty")}),o.on("click",function(e){0===e.nativeEvent.button})}createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED,createjs.Ticker.setFPS(60),createjs.Ticker.addEventListener("tick",onTick)}function onTick(e){stage.update(e)}function onMouseDown(e){var t=map.globalToLocal(e.stageX,e.stageY);0===e.nativeEvent.button&&(drawing=!0,connectionPath=[JSON.stringify(pointToCoord(t))]),2===e.nativeEvent.button&&(dragging=!0,dragOrigin=t),console.log(pointToCoord(t))}function onMouseUp(e){0===e.nativeEvent.button&&(drawing=!1,console.log(connectionPath)),2===e.nativeEvent.button&&(dragging=!1)}function onMouseMove(e){var t=map.globalToLocal(e.stageX,e.stageY);if(drawing){var o=JSON.stringify(pointToCoord(t));_.contains(connectionPath,o)||connectionPath.push(o)}dragging&&(map.x=e.stageX-dragOrigin.x,map.y=e.stageY-dragOrigin.y)}function coordToPoint(e){return point={},point.x=e.q*maskBounds.width*3/4,point.y=e.r*maskBounds.height+e.q%2*maskBounds.height/2,point}function pointToCoord(e){coord={},coord.q=Math.floor(e.x/(3*maskBounds.width/4)),coord.r=Math.floor(e.y/maskBounds.height);for(var t=-1;1>=t;++t)for(var o=-1;1>=o;++o){var a=new createjs.Container,n=new createjs.Bitmap(loader.getResult("tile_mask"));a.hitArea=n;var s={q:coord.q+o,r:coord.r+t},i=coordToPoint(s);if(a.x=i.x,a.y=i.y,map.addChild(a),a.on("rollover",function(){}),_.contains(map.getObjectsUnderPoint(e.x,e.y),a))return map.removeChild(a),s;map.removeChild(a)}}var stage,w,h,loader,map,maskBounds,dragOrigin,dragging=drawing=!1,connectionPath;init();