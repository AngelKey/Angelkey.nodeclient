// Generated by IcedCoffeeScript 1.7.1-a
(function() {
  var PackageJson, gpg, iced, __iced_k, __iced_k_noop;

  iced = require('iced-coffee-script').iced;
  __iced_k = __iced_k_noop = function() {};

  gpg = require('./gpg').gpg;

  PackageJson = require('./package').PackageJson;

  exports.version_info = function(cb) {
    var dat, err, gpg_v, l, lines, pjs, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    pjs = new PackageJson();
    err = lines = [];
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/max/src/keybase-node-client/src/version.iced",
          funcname: "version_info"
        });
        gpg({
          args: ["--version"]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return dat = arguments[1];
            };
          })(),
          lineno: 9
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (err == null) {
          gpg_v = dat.toString().split("\n").slice(0, 2);
          lines = [pjs.bin() + " (keybase.io CLI) v" + pjs.version(), "- node.js " + process.version].concat((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = gpg_v.length; _i < _len; _i++) {
              l = gpg_v[_i];
              _results.push("- " + l);
            }
            return _results;
          })()).concat(["Identifies as: '" + pjs.identify_as() + "'"]);
        }
        return cb(err, lines);
      };
    })(this));
  };

  exports.platform_info = function() {
    var d, k, _i, _len, _ref;
    d = {};
    _ref = ["versions", "arch", "platform", "features"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      d[k] = process[k];
    }
    return d;
  };

}).call(this);