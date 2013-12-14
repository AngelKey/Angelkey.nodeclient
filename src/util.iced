
{fork} = require 'child_process'
path = require 'path'

#=========================================================================

exports.rmkey = (obj, key) ->
  ret = obj[key]
  delete obj[key]
  ret

exports.daemon = (args) ->
  icmd = path.join __dirname, "..", "node_modules", ".bin", "iced"
  fork process.argv[1], args, { execPath : icmd, detatched : true }

# convert from Js -> Unix timestamp
exports.js2unix = (t) -> Math.floor(t/1000)

#=========================================================================

exports.purge = purge = (d) ->
  out = {}
  for k,v of d when v?
    out[k] = if typeof v is 'object' then purge v else v
  return out

#=========================================================================
