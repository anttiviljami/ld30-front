/**
 * server.js
 * keeps internal-state of application in sync with backend.
 * this heavily uses dpd.js from deployd.com
 */

function Server() {
  this.user = {};
  this.game = {};
  this.hexes = {};
  this.connections = {};
  this.startHex = {};
  this.teams = {};
  return this;
}

dpd.on('hex:create', function(hex) {
  console.log('Something happened on socket');
  console.log(hex);
});

dpd.on('hex:update', function(hex) {
  console.log('Something happened on socket');
  console.log(hex);
});


Server.prototype = {
    constructor: Server,
    init:function ()  {
        console.log(this);
        var _this = this;
        //create random user
        //var randomUser = Math.random().toString(36).slice(2);
        var randomUser = 'm2h36yjex4txzuxr';
        /*dpd.users.post({username: randomUser,password: randomUser, team: "125c70d7f342983f"}, function(user,err){
          if(err) return console.log(err);
        });*/
        //and login
        dpd.users.login({username: randomUser,password: randomUser}, function(user,err) {
          if(err) return console.log(err);
          dpd.users.get(user.uid, function(userInfo,err) {
            _this.user = userInfo;
          });
        });
        //get tick and game latest gameinfo
        dpd.games.get({$sort: {startTime: -1}, $limit: 1}, function(game,err) {
          if(err) return console.log(err);
          _this.game = game[0];
        });
        //get random team-location for user
        dpd.hexes.get({owner: this.user.team, $limit: 1}, function(hex){
          _this.startHex = hex[0];
        });
        //get hexes
        dpd.hexes.get(function(hexes){
          _this.hexes = hexes;
        });
        //get connections
        dpd.connections.get(function(connections){
          _this.connections = connections;
        });
        //get teams
        dpd.teams.get(function(teams){
          _this.teams = teams;
        });
    },
    /**
     * Whole world can be quite big. This gets all hexes which are in users context
     * @param qMin, qMax, rMin, rMax  
     * => coordinates of window
     */
    getHexesInWindow:function (qMin, rMin, qMax, rMax) {
      var query = {$and: [{"q": {$gte:qMin}}, {"q": {$lte:qMax}},
                          {"r": {$gte:rMin}}, {"r": {$lte:qMax}}]};
      dpd.hexes.get(query, function (err) {
        if(err) return console.log(err);
        return result;
      });
    },
    /**
     * Player can create connections between servers
     * @param route
     * => array of point objects between start and end eg. [{q:1,r:1},{q:1,r:2}]
     */
    createConnection: function (route) {
      var routeWithoutEnds = route.slice(1, route.length - 1);
      var routeStart = _.first(route);
      var routeEnd = _.last(route);
      var query_object = {startQ: routeStart.q, startR: routeStart.r, endQ: routeEnd.q, endR: routeEnd.r, route: routeWithoutEnds};
      console.log("Creating this connection:");
      console.log(query_object);
      dpd.connections.post(query_object, function(result,err){
        //TODO
        if(err) return console.log(err);
      });
    },
    /**
     * Player can prevent others from connecting to server by rebooting it
     * @param qCoord, rCoord  
     * => coordinates of hex
     */
    rebootNode: function (qCoord,rCoord) {
      dpd.hexes.get({q: qCoord, r: rCoord}, function(hex,err) {
        if(err) return console.log(err);
        dpd.hexes.put(hex.id,{whenAvailableForUse: Date.now()+5000}, function(result,err) {
          if(err) return console.log(err);
        })
      })
    }
}