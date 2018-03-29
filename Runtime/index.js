//
// entrypoint for our little child renderers
require('babel-register')({
  presets: [
    ['env', {
      'targets': {
        'node': 'current'
      }
    }], 'flow', 'stage-0'
  ]
})

const Runtime = require('./Runtime').default
const RT = new Runtime(process.argv[2], process.argv[3])

const main = async () => {
  try {
    RT.start()
  } catch (e) {
    console.trace('start failed', e)
  }
}

main()
