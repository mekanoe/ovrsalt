// @flow
import { JSDOM } from 'jsdom'
import fs from 'fs-extra'
import path from 'path'
import IPC from './IPC'

// forward declaration
type ImageData = window.ImageData

export default class Runtime {
  ipcName: string | null = null
  canvas: HTMLCanvasElement // eslint-disable-line no-undef
  canvCtx: CanvasRenderingContext2D | WebGLRenderingContext // eslint-disable-line no-undef
  dom: JSDOM
  bundle: string
  fps: number = 0.5
  IPC: IPC

  constructor (bundle: string, ipcName?: string = null) {
    this.bundle = bundle

    if (ipcName != null || ipcName !== '') {
      this.ipcName = ipcName
    } else {
      console.warn('No IPC name was set.')
    }
  }

  async loadBundle (name: string): string {
    const pathname = path.join(__dirname, '../Frontend/build', `${name}.bundle.js`)

    try {
      await fs.stat(pathname)
    } catch (e) {
      throw e
    }

    return fs.readFile(pathname, { encoding: 'utf-8' })
  }

  async buildDOM (): void {
    // construct a minimal dom
    const dom: JSDOM = new JSDOM(`<!doctype html><meta charset=utf-8><div id=root>`, { pretendToBeVisual: true, runScripts: 'outside-only' })
    this.dom = dom
    dom.window.path = path
    dom.window.process = process
    dom.window.OVRSalt = {
      triggerFlush: () => this.triggerFlush()
    }

    // grab the bundle...
    const bundle: string = await this.loadBundle(this.bundle)

    // error container
    let err: Error | null = null

    // error tossup helper
    dom.window.exitOnError = (e: Error) => {
      err = e
    }

    // run the bundle..
    try {
      dom.window.eval(`try{${bundle}}catch(e){console.error('bundle run failed');window.exitOnError(e)}`)
    } catch (e) {
      err = e
    }

    // did it error fast?
    await timeout(10)
    if (err != null) {
      throw err
    }

    let retries: number = 0
    // let's try hooking the canvas...
    while (this.canvas == null && retries < 10) {
      retries += 1
      await timeout(100)
      this.canvas = dom.window.document.querySelector('canvas')
    }

    this.canvCtx = this.canvas.getContext('2d')
  }

  getImageData (): ImageData {
    const { width, height } = this.canvas
    return this.canvCtx.getImageData(0, 0, width, height)
  }

  updateLoop (): void {
    this.triggerFlush()
    setTimeout(() => this.updateLoop(), 1000/this.fps)
  }

  triggerFlush (): void {
    const data: ImageData = this.getImageData()
    this.IPC.send(data)
  }

  startIPC (): void {
    this.IPC = new IPC()
    this.IPC.connect(this.ipcName)
  }

  async start () {
    await this.buildDOM()
    await this.startIPC()
    setTimeout(() => {
      try {
        this.updateLoop()
      } catch (e) {
        console.trace('main loop error', e)
      }
    }, 0)
  }
}

const timeout: (ms: number) => Promise<void> = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, ms)
  })
}
