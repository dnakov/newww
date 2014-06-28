var Hapi = require('hapi'),
    log = require('bole')('registry-star'),
    uuid = require('node-uuid');


module.exports = function (request, reply) {
  var star = request.server.methods.star,
      unstar = request.server.methods.unstar;

  var opts = {
    user: request.auth.credentials
  };

  if (request.method === 'get') {
    return reply.redirect('browse/userstar/' + opts.user.name);
  }

  if (typeof opts.user === 'undefined') {
    return reply('user isn\'t logged in').code(403);
  }

  var username = opts.user.name,
      body = JSON.parse(request.payload),
      pkg = body.name,
      starIt = !body.isStarred;

  if (starIt) {
    star(pkg, username, function (err, data) {
      if (err) {
        var errId = uuid.v1();
        log.error(errId + ' ' + Hapi.error.internal(username + 'was unable to star ' + pkg), err);
        return reply('not ok - ' + errId).code(500);
      }

      return reply(username + ' starred ' + pkg).code(200);
    });
  } else {
    unstar(pkg, username, function (err, data) {
      if (err) {
        var errId = uuid.v1();
        log.error(errId + ' ' + Hapi.error.internal(username + 'was unable to unstar ' + pkg), err);
        return reply('not ok - ' + errId).code(500);
      }

      return reply(username + ' unstarred ' + pkg).code(200);
    });
  }
}