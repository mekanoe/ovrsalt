import net from 'net'
import type { Socket } from 'net'

export type RPCPacket = {
  call: string,
  args: Array<any>
}

export type RPCHandlerFunction = (...args: Array<any>) => Promise<bool> | bool

export default class RPC {
  private name: string
  private connected: boolean = false
  private socket: Socket
  private registry: {
    [string]: RPCHandlerFunction
  }

  constructor (name: string | null) {
    if (name != null) {
      this.name = name
      this.connect()
    }
  }

  public send(packet: ): void {

  }

  public connect(): void {

  }
}