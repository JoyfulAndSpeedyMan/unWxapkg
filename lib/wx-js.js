
const { Base } = require('./base')
// const { js_beautify } = require("js-beautify")
const UglifyJS = require("uglify-es")

class WxJs extends Base {
  constructor({ dir, mainDir, root = '', filename = '', moreInfo = false } = {}) {
    super({ dir, mainDir, root, filename, moreInfo })
    this.subPack = root
  }
  static init(dir, root, filename) {
    return new WxJs(dir, root, filename)
  }
  start() {
    this.splitJs()
  }
  splitJs() {
    const dir = this.mainDir || this.dir
    const self = this
    let code = this.getFileContent(this.getPathName(this.filename))

    code = this.handerCode(code)


    self.save(self.getPathName('code2.js', dir), code)
    const needDelList = {}

    if (this.subPack) code = code.slice(code.indexOf("define("))
    console.log('\nsplitJs: ' + this.filename)

    let count = 0
    this.vmRun(code, {
      sandbox: {
        require(p){ },
        definePlugin() { },
        requirePlugin() { },
        define(name, func) {
          let code = func.toString()
          code = code.slice(code.indexOf("{") + 1, code.lastIndexOf("}") - 1).trim()
          let bcode = code
          if (code.startsWith('"use strict";') || code.startsWith("'use strict';"))
            code = code.slice(13)
          else if ((code.startsWith('(function(){"use strict";')
            || code.startsWith("(function(){'use strict';"))
            && code.endsWith("})();"))
            code = code.slice(25, -5)
          let res = self.jsBeautify(code)
          if (typeof res == "undefined") {
            console.log("Fail to delete 'use strict' in \"" + name + "\".")
            res = self.jsBeautify(bcode)
          }
          const filePath = self.getPathName(name, dir)
          needDelList[filePath] = -8
          self.save(filePath, self.jsBeautify(res))
          count++
        },
        __wxConfig: {}
      }
    })
    console.log("Splitting done. counts: ", count)
  }

  handerCode(code) {
    // console.log('replace jsBeautify...')
    // code = this.jsBeautify(code)
    // console.log('replace jsBeautify...done')
    code = this.findAndRelpaceCode(code, /require\s*:/g, " function() { return require; },")
    code = this.findAndRelpaceCode(code, /define\s*:/g, " function() { return define; },")
    return code
  }

  findAndRelpaceCode(code, reg, replace){
    let match;
    if ((match = reg.exec(code)) !== null) {
      console.log('Found "' + match[0] + '" at position ' + match.index);
      let start = match.index + match[0].length
      let i = start
      while (code[i] != ',') {
        i++;
      }
      console.log(`start: ${start}, i: ${i}`)
      let substring = code.substring(start, i + 1)
      console.log('substring: ' + substring)
      code = code.substring(0, start) + replace + code.substring(i + 1)
    }
    return code;
  }

  jsBeautify(code) {
    return UglifyJS.minify(code,
      {
        mangle: false, compress: false,
        output: { beautify: true, comments: true }
      }).code
  }
}

module.exports = {
  WxJs
}