import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const connect = () => {
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        // Reconnect after a delay
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const subscribeToMatch = useCallback((matchId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'subscribe', matchId }));
    }
  }, []);

  const unsubscribeFromMatch = useCallback((matchId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'unsubscribe', matchId }));
    }
  }, []);

  return { isConnected, lastMessage, subscribeToMatch, unsubscribeFromMatch };
}
