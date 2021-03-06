var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect;

var server, source,
    forms = require('./fixtures/signupForms');

// prepare the server
before(function (done) {
  server = require('./fixtures/setupServer')(done);

  server.ext('onPreResponse', function (request, next) {
    source = request.response.source;
    next();
  });
});

describe('Signing up a new user', function () {

  it('renders the signup template', function (done) {
    var options = {
      url: '/signup'
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      done();
    });
  });

  it('fails validation with incomplete form fields', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.incomplete
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0][0]).to.have.deep.property('message', 'verify is required');
      done();
    });  })

  it('fails validation with a bad email address', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.badEmail
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0][0]).to.have.deep.property('message', 'email must be a valid email');
      done();
    });
  });

  it('fails validation with a bad username (dot)', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.badUsernameDot
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0]).to.have.deep.property('message', 'Username may not start with "."');
      done();
    });
  });

  it('fails validation with a bad username (uppercase)', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.badUsernameCaps
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0]).to.have.deep.property('message', 'Username must be lowercase');
      done();
    });
  });

  it('fails validation with a bad username (encodeURI)', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.badUsernameEncodeURI
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0]).to.have.deep.property('message', 'Username may not contain non-url-safe chars');
      done();
    });
  });

  it('fails validation with non-matching passwords', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.invalidPassMatch
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(200);
      expect(source.template).to.equal('signup-form');
      expect(source.context.errors[0]).to.have.deep.property('message', 'Passwords don\'t match');
      done();
    });
  });

  it('passes validation with a valid form', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.good
    }

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(302);
      expect(resp.headers.location).to.include('profile-edit');
      done();
    });
  });

  it('passes validation with an umlaut in the password', function (done) {
    var options = {
      url: '/signup',
      method: 'POST',
      payload: forms.goodPassWithUmlaut
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(302);
      expect(resp.headers.location).to.include('profile-edit');
      done();
    });
  });

});
