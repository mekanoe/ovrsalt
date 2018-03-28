// @flow
import { JSDOM } from 'jsdom'
import fs from 'fs-extra'
import path from 'path'

export default class Runtime {
  private ipcName: string | null = null
  private canvas: HTMLCanvasElement
  private canvCtx: CanvasRenderingContext2D | WebGLRenderingContext
  private dom: JSDOM
  private bundle: string
  private fps: number = 90
  private IPC: IPC

  constructor (bundle: string, ipcName?: string = null) {
    this.bundle = bundle

    if (ipcName != null || ipcName !== '') {
      this.ipcName = ipcName
    } else {
      console.warn("No IPC name was set.")
    }
  }

  private async loadBundle(name: string): string {
  const pathname = path.join(__dirname, '../Frontend/build', `${name}.bundle.js`)
    
    try {
      await fs.stat(pathname)
    } catch (e) {
      throw e
    }

    return fs.readFile(pathname, { encoding: 'utf-8' })
  }

  private async buildDOM(): void {
    // construct a minimal dom
    const dom: JSDOM = new JSDOM(`<!doctype html><meta charset=utf-8><div id=root>`, { pretendToBeVisual: true, runScripts: 'outside-only' })
    this.dom = dom

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
      dom.window.eval(`try{${overlayBundle}}catch(e){console.error('bundle run failed');window.exitOnError(e)}`)
    } catch (e) {
      err = e
    }

    // did it error fast?
    await timeout(10)
    if (e != null) {
      throw e
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

  private getImageData(): ImageData {
    const { width, height } = this.canvas
    return this.canvCtx.getImageData(0, 0, width, height)
  }

  private async updateLoop(): void {
    while (true) {
      const data: ImageData = this.getImageData()
      this.sendIPCPacket(Symbol.for('image'), data)

      await timeout(1000/this.fps)
    }
  }

  private startIPC(): void {
    this.IPC = new IPC(this.ipcName)
  }

  public async start() {
    await this.buildDOM()
    await this.startIPC()
    setTimeout(this.updateLoop(), 0)
  }
}

const timeout: (ms: number) => Promise<void> = (ms: number) => {
  return new Promise<null>((resolve) => {
    setTimeout(() => { resolve() }, ms)
  })
}