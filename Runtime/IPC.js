import { Socket } from 'net'
import { encode } from 'msgpack-lite'

export type FrameData = {|
  width: number,
  height: number,
  frame: Uint8Array
|}

export default class IPC {
  socket: Socket = null

  connect (name: string | null = null) {
    if (name == null) {
      return
    }
    const path = this.getSocketPath(name)

    this.socket = new Socket()
    this.socket.connect(path)
  }

  getSocketPath (name: string): string {
    if (process.platform === 'win32') {
      return `\\\\.\\pipe\\ovrsalt\\${name}`
    } else {
      return `/var/run/ovrsalt-${name}.sock`
    }
  }

  send (data: FrameData) {
    if (this.socket == null) {
      return
    }

    const encData = encode(data)

    this.socket.write(encData)
  }
}
