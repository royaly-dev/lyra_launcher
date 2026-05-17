declare module "discord-rpc" {
  import { EventEmitter } from "node:events";

  type RPCTransport = "ipc" | "websocket";

  interface ClientOptions {
    transport: RPCTransport;
  }

  interface LoginOptions {
    clientId: string;
    clientSecret?: string;
    accessToken?: string;
    rpcToken?: string | boolean;
    tokenEndpoint?: string;
    scopes?: string[];
    redirectUri?: string;
    prompt?: "none" | "consent";
  }

  interface User {
    id: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
    bot?: boolean;
  }

  interface ActivityButton {
    label: string;
    url: string;
  }

  interface Presence {
    state?: string;
    details?: string;
    startTimestamp?: number | Date;
    endTimestamp?: number | Date;
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
    partyId?: string;
    partySize?: number;
    partyMax?: number;
    matchSecret?: string;
    joinSecret?: string;
    spectateSecret?: string;
    instance?: boolean;
    buttons?: ActivityButton[];
  }

  class Client extends EventEmitter {
    constructor(options: ClientOptions);

    application: unknown | null;
    user: User | null;
    clientId: string | null;

    login(options: LoginOptions): Promise<Client>;
    setActivity(activity?: Presence, pid?: number): Promise<unknown>;
    clearActivity(pid?: number): Promise<unknown>;
    subscribe(
      event: string,
      args?: Record<string, unknown>,
    ): Promise<{ unsubscribe: () => Promise<unknown> }>;
    request(
      cmd: string,
      args?: Record<string, unknown>,
      evt?: string,
    ): Promise<unknown>;
    destroy(): Promise<void>;

    on(event: "ready", listener: () => void): this;
    on(event: "connected", listener: () => void): this;
    on(event: "disconnected", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
  }

  function register(clientId: string): boolean;

  const RPC: {
    Client: typeof Client;
    register: typeof register;
  };

  export = RPC;
}
