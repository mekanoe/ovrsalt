//
// entrypoint for our little child renderers

const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')
const Canvas = require('canvas-prebuilt')

// import { JSDOM } from 'jsdom'
// import * as path from 'path'
// import * as fs from 'fs-extra'

async function main () {
  const [overlay, ipcName] = process.argv.slice(2)

  console.log('Starting renderer...')
  console.log('Overlay:', overlay)
  console.log('IPC Name:', ipcName)

  const dom = new JSDOM(`<!doctype html><meta charset=utf-8><div id=root>`, { pretendToBeVisual: true, runScripts: 'outside-only' })

  const overlayPath = path.join(__dirname, '../Frontend/build', `${overlay}.bundle.js`)
  let overlayBundle 
  try {
    overlayBundle = await fs.readFile(overlayPath, { encoding: 'utf-8' })
  } catch (e) {
    console.error('bundle load failed with', e.code)
    process.exit(1)
  }

  let err = false

  dom.window.exitOnError = (e) => {
    console.error('DOM exited on error.', e)
    err = true
  }

  dom.window.path = path
  dom.window.process = process

  console.log('Ready. Starting.')
  try {
    dom.window.eval(`try{${overlayBundle}}catch(e){console.error('bundle run failed');window.exitOnError(e)}`)
  } catch (e) {
    console.error('eval failed.')
    console.trace(e)
  }

  console.log('Waiting 1 second before hooking.')
  await timeout(1000)

  if (err) {
    console.log('Hook will fail, error occurred. Exiting.')
    process.exit(1)
  }

  console.log('Attempting hooking canvas...')
  const canv = dom.window.document.querySelector('canvas') // eslint-disable-line no-undef
  if (canv != null) {
    console.log(`Hooking success! Let's see what's inside!`)
    const ctx = canv.getContext('2d') // eslint-disable-line no-undef

    const { width, height } = {
      width: canv.width,
      height: canv.height
    }

    console.log('Size:', width, 'x', height)

    const imgData = ctx.getImageData(0, 0, width, height) // eslint-disable-line no-undef
    console.log('Pixels:', imgData.data.length / 4, '-- Expected:', width * height)
  } else {
    console.log(`It didn't work. :(`)
  }
}

const timeout = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, timeout)
  })
}

main()
