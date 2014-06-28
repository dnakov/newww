var Hapi = require('hapi'),
    log = require('bole')('couchdb-changeEmail'),
    uuid = require('node-uuid');

module.exports = function changeEmail (service, adminCouch) {
  return function (name, email, next) {
    service.methods.getUserFromCouch(name, function (err, user) {
      if (err) {
        log.error(uuid.v1() + ' ' + Hapi.error.internal('Unable to get user ' + name + ' from couch'), err);
        return next(Hapi.error.internal(err));
      }

      if (user.email === email) {
        return next(null);
      }

      user.email = email;
      adminCouch.put('/_users/org.couchdb.user:' + name, user, function (er, cr, data) {
        if (er || data.error || cr.statusCode >= 400) {
          er = er || new Error(data.error);

          log.error(uuid.v1() + ' ' + Hapi.error.internal('Unable to put user ' + name + ' data into couch'), er);
          return next(Hapi.error.internal(er));
        }

        return next(null);
      });
    });
  };
};