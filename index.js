const { Wxapkg } = require('./lib/wxapkg')
const { Auto } = require('./lib/auto')

let argv = require('minimist')(process.argv.slice(2),
  {
    alias: {
      m: 'more', p: 'port', h: 'help', H: 'host',
      s: 'subpack', a: 'auto'
    }
  })
if (argv.h) {
  return console.log(`
Example usage:
-H --host     server host ip or dnsName
-p --port     port of host
-s --subpack  sub pack unpack
-m --more     more infomation
-a --auto     auto uncode all apkg(subs)
`)
}
console.time("start")

if (argv.a) {
  Auto.init(argv).start()

  console.timeEnd("start")
  return
}

Wxapkg.init(argv).start()

console.timeEnd("start")