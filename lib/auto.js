
const { Base } = require('./base')
const { Wxapkg } = require('./wxapkg')

class Auto extends Base {
  constructor(filename) {
    super()
    this.filename = filename
  }
  static init(argv) {
    const filename = argv.a
    return new Auto(filename)
  }
  start() {
    let files = this.getSubPacks()
    files.unshift({ d: this.filename })
    console.table(files)

    files.forEach(opt => Wxapkg.init(opt).start())
  }
  getApkgNo(filename) {
    let tpl = filename.match(/_[-\d]\d+_(\d+)/)
    return tpl ? tpl[1] : ''
  }
  getSubPacks() {
    this.dir = this.getFileDir(this.filename)
    let files = this.scanDir(this.dir)
    let no = this.getApkgNo(this.filename)
    const s = this.filename
    const ss = this.getFileName(this.filename, '.wxapkg')
    files = files.map(file => this.getFileName(file))
      .filter(name => {
        const n = this.getFileName(name, '.wxapkg')
        return this.getApkgNo(name) === no && n !== ss
      })
      .map(d => this.dir + "\\" + d)
      .map(d => ({ d, s }))
    return files
  }

}

module.exports = { Auto }