
{home} = require './path'
{join} = require 'path'
{constants} = require './constants'
FN = constants.filenames
SRV = constants.server

##=======================================================================

class RunMode

  DEVEL : 0
  PROD : 1
  
  constructor : (s) ->
    t =
      devel : @DEVEL
      prod : @PROD
      
    [ @_v, @_name, @_chosen ] = if (s? and (m = t[s])?) then [m, s, true ]
    else [ @PROD, "prod", false ]

  is_devel : () -> (@_v is @DEVEL)
  is_prod : () -> @_v is @PROD

  toString : () -> @_name
  chosen : () -> @_chosen
  config_dir : () -> @_name

##=======================================================================

class Env

  # Load in all viable command line switching opts
  constructor : () ->
    @env = process.env
    @argv = null
    @config = null

  set_argv   : (a) -> @argv = a
  set_config : (c) -> @config = c

  get_opt : ({env, arg, config, dflt}) ->
    co = @config?.obj
    return env?(@env) or arg?(@argv) or (co? and config? co) or dflt?() or null

  get_port   : ( ) ->
    @get_opt
      env    : (e) -> e.KEYBASE_PORT
      arg    : (a) -> a.port
      config : (c) -> c.server?.port
      dflt   : ( ) -> SRV.port

  get_config_filename : () ->
    @get_opt
      env    : (e) -> e.KEYBASE_CONFIG
      arg    : (a) -> a.c
      dflt   : ( ) -> join home(), FN.config_dir, FN.config_file

  get_host   : ( ) ->
    @get_opt
      env    : (e) -> e.KEYBASE_HOST
      arg    : (a) -> a.host
      config : (c) -> c.server?.host
      dflt   : ( ) -> SRV.host

  get_debug  : ( ) ->
    @get_opt
      env    : (e) -> e.KEYBASE_DEBUG
      arg    : (a) -> a.d
      config : (c) -> c.run?.d
      dflt   : ( ) -> false

  get_no_tls : ( ) ->
    @get_opt
      env    : (e) -> e.KEYBASE_NO_TLS
      arg    : (a) -> a["no-tls"]
      config : (c) -> c.server?.no_tls
      dflt   : ( ) -> false

  get_uri_prefix : () ->
    @get_opt
      env    : (e) -> e.KEYBASE_URI_PREFIX
      arg    : (a) -> a["api-uri-prefix"]
      config : (c) -> c.server?.api_uri_prefix
      dflt   : ( ) -> SRV.api_uri_prefix

  get_run_mode : () ->
    unless @_run_mode
      raw = @get_opt
        env    : (e) -> e.KEYBASE_RUN_MODE
        arg    : (a) -> a.m
        config : (c) -> c.run?.mode
        dflt   : null
      @_run_mode = new RunMode raw
    return @_run_mode

  get_log_level : () ->
    @get_opt
      env    : (e) -> e.KEYBASE_LOG_LEVEL
      arg    : (a) -> a.l
      config : (c) -> c.run?.log_level
      dflt   : -> null

  get_args : () -> @argv._
  get_argv : () -> @argv

##=======================================================================

_env = null
exports.init_env = (a) -> _env = new Env 
exports.env      = ()  -> _env

