import type { HubConnection } from "@microsoft/signalr";
import { HubConnectionState } from "@microsoft/signalr";
import { demoSendChatMessage } from "./handler";

type Handler = (...args: unknown[]) => void | Promise<void>;

/**
 * A minimal stand-in for the SignalR hub used in demo mode. Messages are
 * stored in the demo dataset and the other person replies after a moment.
 */
export function createDemoChatConnection(token: string): HubConnection {
  const role = token === "demo-mentor-token" ? "Mentor" : "Student";
  const handlers = new Map<string, Set<Handler>>();
  let state = HubConnectionState.Disconnected;

  const emit = (event: string, ...args: unknown[]) => {
    handlers.get(event)?.forEach((h) => void h(...args));
  };

  const connection = {
    get state() {
      return state;
    },
    async start() {
      state = HubConnectionState.Connected;
    },
    async stop() {
      state = HubConnectionState.Disconnected;
    },
    on(event: string, handler: Handler) {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event)!.add(handler);
    },
    off(event: string) {
      handlers.delete(event);
    },
    onclose() {
      /* never closes in demo mode */
    },
    onreconnecting() {
      /* no-op */
    },
    onreconnected() {
      /* no-op */
    },
    async invoke(method: string, ...args: unknown[]) {
      if (method !== "SendMessage") return;
      const [assignmentId, text] = args as [number, string];
      const { reply } = demoSendChatMessage(assignmentId, text, role);
      emit("ReceiveMessage", "", text, new Date().toISOString());
      setTimeout(() => {
        reply();
        emit("ReceiveMessage", "", "", new Date().toISOString());
      }, 1800);
    },
    async send() {
      /* no-op */
    },
  };

  return connection as unknown as HubConnection;
}
