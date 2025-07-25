import { API_URL } from "@/lib/constants";
import { tryCatch } from "@/lib/utils/try-catch";
import type { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function useChat({
  token,
  activeAssignmentId,
}: {
  token: string;
  activeAssignmentId?: number;
}) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, startConnecting] = useTransition();
  const queryClient = useQueryClient();

  // Establish connection to SignalR hub
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/chatHub`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      newConnection
        .stop()
        .catch((err) =>
          console.error("Error stopping SignalR connection:", err),
        );
    };
  }, [token]);

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection || !activeAssignmentId) return;

    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        console.log("SignalR Connected.");
        return;
      }

      // Start connection
      const { error: startConnectionError } = await tryCatch(
        connection.start(),
      );
      if (startConnectionError) {
        console.error("SignalR Connection Error:", startConnectionError);
        setConnectionError("Failed to connect to chat server. Retrying...");
        toast.error("Failed to connect to chat server. Retrying...");
      }

      // Join chat
      const { error: joinChatError } = await tryCatch(
        connection.invoke("JoinChat", activeAssignmentId),
      );
      if (joinChatError) {
        console.error("SignalR Join Chat Error:", joinChatError);
        setConnectionError("Failed to join chat. Retrying...");
        toast.error("Failed to join chat. Retrying...");
      }

      // Setup listeners
      connection.on(
        "ReceiveMessage",
        async (_senderId: string, _text: string, _sentAt: string) => {
          await queryClient.invalidateQueries({
            queryKey: ["chat-messages", activeAssignmentId],
          });
        },
      );
    };

    startConnecting(async () => {
      await startConnection();
    });

    connection.onclose((error) => {
      if (!error) {
        return;
      }

      console.error("SignalR Disconnected:", error);
      setConnectionError("Connection lost. Attempting to reconnect...");
    });

    connection.onreconnecting((err) => {
      console.warn("SignalR Reconnecting:", err);
      setConnectionError("Reconnecting to chat server...");
    });

    connection.onreconnected(() => {
      console.log("SignalR Reconnected.");
      setConnectionError(null);
      connection.invoke("JoinChat", activeAssignmentId).catch((err) => {
        console.error("Error rejoining group:", err);
        setConnectionError("Failed to rejoin chat. Please refresh the page.");
      });
    });

    return () => {
      connection
        .stop()
        .catch((err) =>
          console.error("Error stopping SignalR connection:", err),
        );
    };
  }, [connection, activeAssignmentId, token, queryClient]);

  return { connection, isConnecting, connectionError };
}
