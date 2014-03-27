// Generated by IcedCoffeeScript 1.7.1-b
(function() {
  var BAD_X, Base, CHECK, E, GenericWebSite, Github, SocialNetwork, Twitter, alloc_stub, cheerio, colors, env, iced, log, my_request, proofs, proxyca, request, root_certs, semver, __iced_k, __iced_k_noop, _certs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-coffee-script').iced;
  __iced_k = __iced_k_noop = function() {};

  log = require('./log');

  request = require('request');

  cheerio = require('cheerio');

  env = require('./env').env;

  proofs = require('keybase-proofs');

  E = require('./err').E;

  _ref = require('./display'), CHECK = _ref.CHECK, BAD_X = _ref.BAD_X;

  colors = require('colors');

  proxyca = require('./proxyca');

  root_certs = require('../json/node_root_certs.json');

  semver = require('semver');

  _certs = null;

  my_request = function(opts, cb) {
    var k, v;
    if (semver.lt(process.version, "0.10.26")) {
      if (_certs == null) {
        _certs = (function() {
          var _results;
          _results = [];
          for (k in root_certs) {
            v = root_certs[k];
            _results.push(v);
          }
          return _results;
        })();
      }
      if (opts.ca == null) {
        opts.ca = _certs;
      }
    }
    return request(opts, cb);
  };

  Base = (function() {
    function Base() {
      this.make_scraper();
    }

    Base.prototype.make_scraper = function() {
      var klass, _ref1;
      klass = this.get_scraper_klass();
      return this._scraper = new klass({
        libs: {
          cheerio: cheerio,
          request: my_request,
          log: log
        },
        log_level: 'debug',
        proxy: env().get_proxy(),
        ca: (_ref1 = proxyca.get()) != null ? _ref1.data() : void 0
      });
    };

    Base.prototype.single_occupancy = function() {
      return false;
    };

    Base.prototype.scraper = function() {
      return this._scraper;
    };

    Base.prototype.get_sub_id = function() {
      return null;
    };

    Base.prototype.validate = function(arg, cb) {
      var err, rc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/node-client/src/scrapers.iced",
            funcname: "Base.validate"
          });
          _this._scraper.validate(arg, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return rc = arguments[1];
              };
            })(),
            lineno: 52
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, rc);
        };
      })(this));
    };

    return Base;

  })();

  SocialNetwork = (function(_super) {
    __extends(SocialNetwork, _super);

    function SocialNetwork() {
      return SocialNetwork.__super__.constructor.apply(this, arguments);
    }

    SocialNetwork.prototype.format_msg = function(_arg) {
      var arg, ok;
      arg = _arg.arg, ok = _arg.ok;
      return [(ok ? CHECK : BAD_X), '"' + ((ok ? colors.green : colors.red)(arg.username)) + '"', "on", this.which() + ":", arg.human_url];
    };

    SocialNetwork.prototype.to_list_display = function(arg) {
      return arg.username;
    };

    SocialNetwork.prototype.check_proof = function(check_data_json) {
      return (check_data_json != null ? check_data_json.name : void 0) === this.which();
    };

    return SocialNetwork;

  })(Base);

  exports.Twitter = Twitter = (function(_super) {
    __extends(Twitter, _super);

    function Twitter() {}

    Twitter.prototype.get_scraper_klass = function() {
      return proofs.TwitterScraper;
    };

    Twitter.prototype.which = function() {
      return "twitter";
    };

    return Twitter;

  })(SocialNetwork);

  exports.Github = Github = (function(_super) {
    __extends(Github, _super);

    function Github() {}

    Github.prototype.get_scraper_klass = function() {
      return proofs.GithubScraper;
    };

    Github.prototype.which = function() {
      return "github";
    };

    return Github;

  })(SocialNetwork);

  exports.GenericWebSite = GenericWebSite = (function(_super) {
    __extends(GenericWebSite, _super);

    function GenericWebSite() {}

    GenericWebSite.prototype.get_scraper_klass = function() {
      return proofs.GenericWebSiteScraper;
    };

    GenericWebSite.prototype.get_sub_id = function(o) {
      var x;
      return ((function() {
        var _i, _len, _ref1, _results;
        _ref1 = [o.protocol, o.hostname];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          x = _ref1[_i];
          _results.push(x.toLowerCase());
        }
        return _results;
      })()).join("//");
    };

    GenericWebSite.prototype.to_list_display = function(o) {
      return this.get_sub_id(o);
    };

    GenericWebSite.prototype.format_msg = function(_arg) {
      var arg, color, display, ok;
      arg = _arg.arg, display = _arg.display, ok = _arg.ok;
      color = !ok ? 'red' : arg.protocol === 'http:' ? 'yellow' : 'green';
      return [(ok ? CHECK : BAD_X), "admin of", colors[color](arg.hostname), "via", colors[color](arg.protocol.toUpperCase()), arg.human_url];
    };

    GenericWebSite.prototype.check_proof = function(check_data_json) {
      return (check_data_json.protocol != null) && (check_data_json.hostname != null);
    };

    return GenericWebSite;

  })(Base);

  exports.alloc = function(type, cb) {
    var err, o;
    o = alloc_stub(type);
    if (o != null) {
      o.make_scraper();
    } else {
      err = new E.ScrapeError("cannot allocate scraper of type " + type);
    }
    return cb(err, o);
  };

  exports.alloc_stub = alloc_stub = function(type) {
    var PT, err, klass, scraper;
    PT = proofs.constants.proof_types;
    err = scraper = null;
    klass = (function() {
      switch (type) {
        case PT.twitter:
          return Twitter;
        case PT.github:
          return Github;
        case PT.generic_web_site:
          return GenericWebSite;
        default:
          return null;
      }
    })();
    if (klass) {
      return new klass({});
    } else {
      return null;
    }
  };

}).call(this);