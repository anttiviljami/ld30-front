function Server(){return this.user={},this.game={},this.hexes={},this.connections={},this.startHex={},this.teams={},this}dpd.on("hex:create",function(e){console.log("Something happened on socket"),console.log(e)}),dpd.on("hex:update",function(e){console.log("Something happened on socket"),console.log(e)}),Server.prototype={constructor:Server,init:function(){console.log(this);var e=this,o="m2h36yjex4txzuxr";dpd.users.login({username:o,password:o},function(o,n){return n?console.log(n):void dpd.users.get(o.uid,function(o,n){e.user=o})}),dpd.games.get({$sort:{startTime:-1},$limit:1},function(o,n){return n?console.log(n):void(e.game=o[0])}),dpd.hexes.get({owner:this.user.team,$limit:1},function(o){e.startHex=o[0]}),dpd.hexes.get(function(o){e.hexes=o}),dpd.connections.get(function(o){e.connections=o}),dpd.teams.get(function(o){e.teams=o})},getHexesInWindow:function(e,o,n,t){var s={$and:[{q:{$gte:e}},{q:{$lte:n}},{r:{$gte:o}},{r:{$lte:n}}]};dpd.hexes.get(s,function(e){return e?console.log(e):result})},createConnection:function(e){var o=e.slice(1,e.length-2),n=_.first(e),t=_.last(e),s={startQ:n.q,startR:n.r,endQ:t.q,endR:t.r,route:o};console.log("Creating this connection:"),console.log(s),dpd.connections.post(s,function(e,o){return o?console.log(o):void 0})},rebootNode:function(e,o){dpd.hexes.get({q:e,r:o},function(e,o){return o?console.log(o):void dpd.hexes.put(e.id,{whenAvailableForUse:Date.now()+5e3},function(e,o){return o?console.log(o):void 0})})}};