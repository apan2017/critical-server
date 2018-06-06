const ts = () => new Date().toISOString()

module.exports = {
  info: (msg) => {
    console.info(`${ts()}-[INFO]: `, msg)
  },
  err: (msg) => {
    console.info(`${ts()}-[ERROR]: `, msg)
  }
}