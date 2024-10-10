import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  private socket!: WebSocket;

  constructor() {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => {
      console.log('WebSocket connection opened.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  // Send message to the signaling server
  sendMessage(eventName: string, data: any) {
    const message = JSON.stringify({ event: eventName, data });
    this.socket.send(message);
  }

  // Listen for incoming messages
  listenForMessages(callback: (event: string, data: any) => void) {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      callback(message.event, message.data);
    };
  }
}
