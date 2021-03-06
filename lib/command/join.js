// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var ArgumentParser, Base, Command, E, PackageJson, Prompter, SC, add_option_dict, checkers, constants, dict_union, env, iced, log, make_esc, prompt_yn, read, req, rng, session, triplesec, __iced_k, __iced_k_noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime').iced;
  __iced_k = __iced_k_noop = function() {};

  Base = require('./base').Base;

  log = require('../log');

  ArgumentParser = require('argparse').ArgumentParser;

  add_option_dict = require('./argparse').add_option_dict;

  PackageJson = require('../package').PackageJson;

  E = require('../err').E;

  _ref = require('../prompter'), prompt_yn = _ref.prompt_yn, Prompter = _ref.Prompter;

  checkers = require('../checkers').checkers;

  make_esc = require('iced-error').make_esc;

  triplesec = require('triplesec');

  rng = require('crypto').rng;

  constants = require('../constants').constants;

  SC = constants.security;

  req = require('../req');

  env = require('../env').env;

  read = require('read');

  session = require('../session');

  dict_union = require('../util').dict_union;

  exports.Command = Command = (function(_super) {
    __extends(Command, _super);

    function Command() {
      return Command.__super__.constructor.apply(this, arguments);
    }

    Command.prototype.OPTS = {
      e: {
        aliases: ['email'],
        help: 'the email address to signup'
      },
      u: {
        aliases: ['username'],
        help: 'the username to signup as'
      }
    };

    Command.prototype.use_session = function() {
      return true;
    };

    Command.prototype.add_subcommand_parser = function(scp) {
      var name, opts, sub;
      opts = {
        aliases: ["signup"],
        help: "establish a new account on keybase.io"
      };
      name = "join";
      sub = scp.addParser(name, opts);
      return opts.aliases.concat([name]);
    };

    Command.prototype.prompt = function(cb) {
      var e, err, p, seq, u, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      seq = {
        email: {
          prompt: "Your email",
          checker: checkers.email
        },
        invite: {
          prompt: "Invitation code (leave blank if you don't have one)",
          thrower: function(k, s) {
            if ((s.match(/^\s*$/)) != null) {
              return new E.CleanCancelError(k);
            } else {
              return null;
            }
          }
        },
        username: {
          prompt: "Your desired username",
          checker: checkers.username
        },
        passphrase: {
          prompt: "Your login passphrase",
          passphrase: true,
          checker: checkers.passphrase,
          confirm: {
            prompt: "Repeat to confirm"
          }
        }
      };
      if (!this.prompter) {
        if ((u = env().get_username()) != null) {
          seq.username.defval = u;
        }
        if ((p = env().get_passphrase()) != null) {
          seq.passphrase.defval = p;
        }
        if ((e = env().get_email()) != null) {
          seq.email.defval = e;
        }
        this.prompter = new Prompter(seq);
      }
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.prompt"
          });
          _this.prompter.run(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 73
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err === "undefined" || err === null) {
            _this.data = _this.prompter.data();
          }
          return cb(err);
        };
      })(this));
    };

    Command.prototype.gen_pwh = function(cb) {
      var err, passphrase, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      passphrase = this.data.passphrase;
      (function(_this) {
        return (function(__iced_k) {
          if (!_this.pp_last || (_this.pp_last !== passphrase)) {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/jacko/node-client/src/command/join.iced",
                funcname: "Command.gen_pwh"
              });
              session.gen_pwh({
                passphrase: passphrase
              }, __iced_deferrals.defer({
                assign_fn: (function(__slot_1, __slot_2, __slot_3) {
                  return function() {
                    err = arguments[0];
                    __slot_1.pwh = arguments[1];
                    __slot_2.salt = arguments[2];
                    return __slot_3.pwh_version = arguments[3];
                  };
                })(_this, _this, _this),
                lineno: 82
              }));
              __iced_deferrals._fulfill();
            })(function() {
              return __iced_k(typeof err === "undefined" || err === null ? _this.pp_last = passphrase : void 0);
            });
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err);
        };
      })(this));
    };

    Command.prototype.post = function(cb) {
      var args, body, err, retry, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      args = {
        salt: this.salt.toString('hex'),
        pwh: this.pwh.toString('hex'),
        username: this.data.username,
        email: this.data.email,
        invitation_id: this.data.invite,
        pwh_version: this.pwh_version
      };
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.post"
          });
          req.post({
            endpoint: "signup",
            args: args
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return body = arguments[1];
              };
            })(),
            lineno: 97
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          retry = false;
          if ((typeof err !== "undefined" && err !== null) && (err instanceof E.KeybaseError)) {
            switch (body.status.name) {
              case 'BAD_SIGNUP_EMAIL_TAKEN':
                log.error("Email address '" + _this.data.email + "' already registered");
                retry = true;
                _this.prompter.clear('email');
                err = null;
                break;
              case 'BAD_SIGNUP_USERNAME_TAKEN':
                log.error("Username '" + _this.data.username + "' already registered");
                retry = true;
                _this.prompter.clear('username');
                err = null;
                break;
              case 'INPUT_ERROR':
                if (err.fields.username) {
                  log.error("Username '" + _this.data.username + "' was rejected by the server");
                  retry = true;
                  _this.prompter.clear('username');
                  err = null;
                }
                break;
              case 'BAD_INVITATION_CODE':
                log.error("Bad invitation code '" + _this.data.invite + "' given");
                retry = true;
                _this.prompter.clear('invite');
                err = null;
            }
          }
          if (err == null) {
            _this.uid = body.uid;
            session.set_id(body.session);
            session.set_csrf(body.csrf_token);
          } else if (!retry) {
            log.error("Unexpected error: " + err);
          }
          return cb(err, retry);
        };
      })(this));
    };

    Command.prototype.write_out = function(cb) {
      var esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Join::write_out");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.write_out"
          });
          _this.write_config(esc(__iced_deferrals.defer({
            lineno: 135
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/home/jacko/node-client/src/command/join.iced",
              funcname: "Command.write_out"
            });
            session.write(esc(__iced_deferrals.defer({
              lineno: 136
            })));
            __iced_deferrals._fulfill();
          })(function() {
            return cb(null);
          });
        };
      })(this));
    };

    Command.prototype.write_config = function(cb) {
      var c, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      c = env().config;
      c.set("user.email", this.data.email);
      c.set("user.salt", this.salt.toString('hex'));
      c.set("user.name", this.data.username);
      c.set("user.id", this.uid);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.write_config"
          });
          c.write(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 147
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err);
        };
      })(this));
    };

    Command.prototype.check_registered = function(cb) {
      var err, opts, rereg, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      err = null;
      (function(_this) {
        return (function(__iced_k) {
          if ((env().config.get("user.id")) != null) {
            opts = {
              prompt: "Already registered; do you want to reregister?",
              defval: false
            };
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/jacko/node-client/src/command/join.iced",
                funcname: "Command.check_registered"
              });
              prompt_yn(opts, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    err = arguments[0];
                    return rereg = arguments[1];
                  };
                })(),
                lineno: 158
              }));
              __iced_deferrals._fulfill();
            })(function() {
              return __iced_k((err == null) && !rereg ? err = new E.CancelError("registration canceled") : void 0);
            });
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err);
        };
      })(this));
    };

    Command.prototype.request_invite = function(cb) {
      var d2, esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "request_invite");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.request_invite"
          });
          _this.ri_prompt_for_ok(esc(__iced_deferrals.defer({
            lineno: 167
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/home/jacko/node-client/src/command/join.iced",
              funcname: "Command.request_invite"
            });
            _this.ri_prompt_for_data(esc(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return d2 = arguments[0];
                };
              })(),
              lineno: 168
            })));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/jacko/node-client/src/command/join.iced",
                funcname: "Command.request_invite"
              });
              _this.ri_post_request(d2, esc(__iced_deferrals.defer({
                lineno: 169
              })));
              __iced_deferrals._fulfill();
            })(function() {
              return cb(null);
            });
          });
        };
      })(this));
    };

    Command.prototype.ri_prompt_for_ok = function(cb) {
      var err, go, opts, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      opts = {
        prompt: "Would you like to be added to the invite list?",
        defval: true
      };
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.ri_prompt_for_ok"
          });
          prompt_yn(opts, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return go = arguments[1];
              };
            })(),
            lineno: 178
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if ((typeof err === "undefined" || err === null) && !go) {
            err = new E.CancelError("invitation request canceled");
          }
          return cb(err);
        };
      })(this));
    };

    Command.prototype.ri_prompt_for_data = function(cb) {
      var err, prompter, ret, seq, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      seq = {
        full_name: {
          prompt: "Your name"
        },
        notes: {
          prompt: "Any comments for the team"
        }
      };
      prompter = new Prompter(seq);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.ri_prompt_for_data"
          });
          prompter.run(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 192
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          ret = null;
          if (typeof err === "undefined" || err === null) {
            ret = prompter.data();
          }
          return cb(err, ret);
        };
      })(this));
    };

    Command.prototype.ri_post_request = function(d2, cb) {
      var args, err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      args = dict_union(d2, this.prompter.data());
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.ri_post_request"
          });
          req.post({
            endpoint: "invitation_request",
            args: args
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 201
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err === "undefined" || err === null) {
            log.info("Success! You're on our list. Thanks for your interest!");
          }
          return cb(err);
        };
      })(this));
    };

    Command.prototype.run = function(cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.run"
          });
          _this.run2(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 209
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            if ((typeof err !== "undefined" && err !== null) && (err instanceof E.CleanCancelError)) {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/home/jacko/node-client/src/command/join.iced",
                  funcname: "Command.run"
                });
                _this.request_invite(__iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return err = arguments[0];
                    };
                  })(),
                  lineno: 211
                }));
                __iced_deferrals._fulfill();
              })(__iced_k);
            } else {
              return __iced_k();
            }
          })(function() {
            return cb(err);
          });
        };
      })(this));
    };

    Command.prototype.run2 = function(cb) {
      var esc, retry, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Join::run");
      retry = true;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/home/jacko/node-client/src/command/join.iced",
            funcname: "Command.run2"
          });
          _this.check_registered(esc(__iced_deferrals.defer({
            lineno: 219
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            var _results, _while;
            _results = [];
            _while = function(__iced_k) {
              var _break, _continue, _next;
              _break = function() {
                return __iced_k(_results);
              };
              _continue = function() {
                return iced.trampoline(function() {
                  return _while(__iced_k);
                });
              };
              _next = function(__iced_next_arg) {
                _results.push(__iced_next_arg);
                return _continue();
              };
              if (!retry) {
                return _break();
              } else {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/home/jacko/node-client/src/command/join.iced",
                    funcname: "Command.run2"
                  });
                  _this.prompt(esc(__iced_deferrals.defer({
                    lineno: 221
                  })));
                  __iced_deferrals._fulfill();
                })(function() {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/home/jacko/node-client/src/command/join.iced",
                      funcname: "Command.run2"
                    });
                    _this.gen_pwh(esc(__iced_deferrals.defer({
                      lineno: 222
                    })));
                    __iced_deferrals._fulfill();
                  })(function() {
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "/home/jacko/node-client/src/command/join.iced",
                        funcname: "Command.run2"
                      });
                      _this.post(esc(__iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            return retry = arguments[0];
                          };
                        })(),
                        lineno: 223
                      })));
                      __iced_deferrals._fulfill();
                    })(_next);
                  });
                });
              }
            };
            _while(__iced_k);
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/home/jacko/node-client/src/command/join.iced",
                funcname: "Command.run2"
              });
              _this.write_out(esc(__iced_deferrals.defer({
                lineno: 224
              })));
              __iced_deferrals._fulfill();
            })(function() {
              log.info("Success! You are now signed up.");
              log.console.log("\nWelcome to keybase.io! You now need to associate a public key with your\naccount.  If you have a key already then:\n\n    keybase push <key-id>  # if you know the ID of the key --- OR ---\n    keybase push           # to select from a menu\n\nIf you need a public key, we'll happily generate one for you:\n\n    keybase gen --push     # Generate a new key and push public part to server\n\nEnjoy!");
              return cb(null);
            });
          });
        };
      })(this));
    };

    return Command;

  })(Base);

}).call(this);
