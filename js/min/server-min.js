function Server(){return this.user={},this.game={},this.hexes={},this.connections={},this.startHex={},this.teams={},this}Server.prototype={constructor:Server,init:function(){var e=this,t="m2h36yjex4txzuxr";dpd.users.login({username:t,password:t},function(t,n){return n?console.log(n):void(e.user=t)}),dpd.games.get({$sort:{startTime:-1},$limit:1},function(t,n){return n?console.log(n):void(e.game=t[0])}),dpd.hexes.get({owner:this.user.team,$limit:1},function(t){e.startHex=t[0]}),dpd.hexes.get(function(t){e.hexes=t}),dpd.connections.get(function(t){e.connections=t}),dpd.teams.get(function(t){e.teams=t})},getHexesInWindow:function(e,t,n,o){var s={$and:[{q:{$gte:e}},{q:{$lte:n}},{r:{$gte:t}},{r:{$lte:n}}]};dpd.hexes.get(s,function(e){return e?console.log(e):result})},createConnection:function(){}};