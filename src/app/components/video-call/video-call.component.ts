// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// // import { SignalingService } from '../signaling.service';

// @Component({
//   selector: 'app-video-call',
//   templateUrl: './video-call.component.html',
//   styleUrls: ['./video-call.component.scss']
// })
// export class VideoCallComponent implements AfterViewInit {

//    localUserId: string = '';
//   remoteUserId: string = '';
//   roomId: string = '';
//   newRoomId: string = '';   // Property for the room ID to create
//   joinRoomId: string = '';  // Property for the room ID to join
//   chatMessage: string = ''; // Property to hold the current chat message
//   chatMessages: string[] = []; // Array to store the chat messages

//   @ViewChild('localVideo') localVideoRef!: ElementRef;
//   @ViewChild('remoteVideo') remoteVideoRef!: ElementRef;

//   localStream!: MediaStream;
//   peerConnection!: RTCPeerConnection;
//   signalingServer!: WebSocket;

//   // constructor(private videoCallService: VideoCallServiceService) { }

//   ngAfterViewInit() {
//     // this.startLocalVideo();
//     this.setupSignalingServer();
//   }

//   // 1. Start local video
//   async startLocalVideo() {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       this.localStream = mediaStream;

//       console.log('Local media stream:', this.localStream);  // Debugging line

//       if (this.localVideoRef && this.localVideoRef.nativeElement) {
//         this.localVideoRef.nativeElement.srcObject = this.localStream;
//         console.log("Local video stream is set!");
//       } else {
//         console.error('Local video reference is not set.');
//       }
//     } catch (err) {
//       console.error("Failed to get local media", err);
//       alert("Failed to access your camera or microphone. Please check permissions.");
//     }
//   }

//   // 2. Setup WebSocket signaling server
//   setupSignalingServer() {
//     this.signalingServer = new WebSocket('ws://localhost:8080');

//     this.signalingServer.onmessage = (event) => {
//       this.handleSignalingMessage(event.data);
//     };
//   }

//   // 3. Handle signaling message (e.g., offer, answer, ICE candidates)
//   handleSignalingMessage(message: string) {
//     const data = JSON.parse(message);

//     if (data.offer) {
//       this.createPeerConnection(false);
//       this.createAnswer(data.offer);
//     } else if (data.answer) {
//       this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
//     } else if (data.candidate) {
//       this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//     } else if (data.chat) {
//       // Handle incoming chat messages
//       this.chatMessages.push(data.chat);
//     }
//   }

//   // 4. Create WebRTC peer connection
//   createPeerConnection(isCaller: boolean) {
//     this.peerConnection = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' }
//       ]
//     });

//     // Handle ICE candidates
//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.signalingServer.send(JSON.stringify({ 'candidate': event.candidate }));
//       }
//     };

//     // Handle remote stream (received from the other peer)
//     this.peerConnection.ontrack = (event) => {
//       if (this.remoteVideoRef && this.remoteVideoRef.nativeElement) {
//         this.remoteVideoRef.nativeElement.srcObject = event.streams[0];
//         console.log("Remote video stream is set!");
//       } else {
//         console.error('Remote video reference is not set.');
//       }
//     };

//     // Add local media stream tracks to the connection
//     this.localStream.getTracks().forEach(track => {
//       this.peerConnection.addTrack(track, this.localStream);
//     });

//     if (isCaller) {
//       this.createOffer();
//     }
//   }

//   // 5. Create offer (Caller side)
//   async createOffer() {
//     try {
//       const offer = await this.peerConnection.createOffer();
//       await this.peerConnection.setLocalDescription(offer);
//       this.signalingServer.send(JSON.stringify({ 'offer': offer }));
//     } catch (error) {
//       console.error("Error creating offer:", error);
//     }
//   }

//   // 6. Create answer (Receiver side)
//   async createAnswer(offer: RTCSessionDescription) {
//     try {
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(answer);
//       this.signalingServer.send(JSON.stringify({ 'answer': answer }));
//     } catch (error) {
//       console.error("Error creating answer:", error);
//     }
//   }

//   // 7. Start a call (Caller)
//   startCall() {
//     this.createPeerConnection(true);
//   }

//   // 8. Answer a call (Receiver)
//   answerCall() {
//     this.createPeerConnection(false);
//   }

//   // 9. Chat functionality
//   sendMessage() {
//     if (this.chatMessage.trim() !== '') {
//       // Add message to chat display
//       this.chatMessages.push(this.chatMessage);

//       // Send message to other peers
//       this.signalingServer.send(JSON.stringify({ 'chat': this.chatMessage }));

//       // Clear the input field
//       this.chatMessage = '';
//     }
//   }

//   // 10. Create room (Caller)
//   createRoom(roomId: string) {
//     if (roomId.trim() === '') {
//       console.error("Room ID is required to create a room");
//       return;
//     }
//     this.roomId = roomId;
//     this.signalingServer.send(JSON.stringify({ 'roomId': this.roomId }));
//     this.startCall();
//   }

//   // 11. Join room (Receiver)
//   joinRoom(roomId: string) {
//     if (roomId.trim() === '') {
//       console.error("Room ID is required to join a room");
//       return;
//     }
//     this.roomId = roomId;
//     this.signalingServer.send(JSON.stringify({ 'roomId': this.roomId }));
//     this.answerCall();
//   }
// }


// import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// @Component({
//   selector: 'app-video-call',
//   templateUrl: './video-call.component.html',
//   styleUrls: ['./video-call.component.scss']
// })
// export class VideoCallComponent implements AfterViewInit {
//   localUserId: string = '';
//   remoteUserId: string = '';
//   roomId: string = '';
//   newRoomId: string = '';  
//   joinRoomId: string = '';  
//   chatMessage: string = '';
//   chatMessages: string[] = [];
//   manualSDP: string = '';

//   @ViewChild('localVideo') localVideoRef!: ElementRef;
//   @ViewChild('remoteVideo') remoteVideoRef!: ElementRef;

//   localStream!: MediaStream;
//   peerConnection!: RTCPeerConnection;
//   signalingServer!: WebSocket;

//   pendingCandidates: RTCIceCandidate[] = []; // Moved outside to be class-level

//   ngAfterViewInit() {
//     this.setupSignalingServer();
//     this.startLocalVideo();
//   }

//   async startLocalVideo() {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       this.localStream = mediaStream;

//       if (this.localVideoRef && this.localVideoRef.nativeElement) {
//         this.localVideoRef.nativeElement.srcObject = this.localStream;
//         console.log("Local video stream is set!");
//       }
//     } catch (err) {
//       console.error("Failed to get local media", err);
//       alert("Failed to access your camera or microphone. Please check permissions.");
//     }
//   }

//   setupSignalingServer() {
//     this.signalingServer = new WebSocket('ws://localhost:8080');

//     this.signalingServer.onopen = () => {
//       console.log("Connected to the signaling server");
//     };

//     this.signalingServer.onmessage = (event) => {
//       this.handleSignalingMessage(event.data);
//     };

//     this.signalingServer.onerror = (error) => {
//       console.error("WebSocket error observed:", error);
//     };

//     this.signalingServer.onclose = () => {
//       console.log("WebSocket connection closed");
//     };
//   }

//   handleSignalingMessage(message: string) {
//     const data = JSON.parse(message);

//     if (data.mute !== undefined) {
//       const remoteUserMuted = data.muted;
//       console.log("Remote user muted:", remoteUserMuted);
//       // Update UI accordingly
//     }

//     if (data.offer) {
//       console.log("Received offer:", data.offer);
//       this.createPeerConnection(false);
//       this.createAnswer(data.offer);
//     } else if (data.answer) {
//       console.log("Received answer:", data.answer);
//       this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
//         .then(() => {
//           console.log("Remote description set with answer");
//           // Add any pending ICE candidates now that the remote description is set
//           this.pendingCandidates.forEach(candidate => {
//             this.peerConnection.addIceCandidate(candidate).catch(error => {
//               console.error("Error adding pending ICE candidate:", error);
//             });
//           });
//           this.pendingCandidates = []; // Clear pending candidates once added
//         })
//         .catch(error => {
//           console.error("Error setting remote description with answer:", error);
//         });
//     } else if (data.candidate) {
//       console.log("Received ICE candidate:", data.candidate);
//       const candidate = new RTCIceCandidate(data.candidate);
//       if (this.peerConnection.remoteDescription) {
//         this.peerConnection.addIceCandidate(candidate).catch(error => {
//           console.error("Error adding ICE candidate:", error);
//         });
//       } else {
//         console.log("Remote description not set yet, storing candidate");
//         this.pendingCandidates.push(candidate);
//       }
//     } else if (data.chat) {
//       this.chatMessages.push(data.chat);
//     }
//   }

//   createPeerConnection(isCaller: boolean) {
//     this.peerConnection = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//       ]
//     });

//     console.log("Peer connection created:", this.peerConnection);

//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log("ICE candidate generated:", event.candidate);
//         this.signalingServer.send(JSON.stringify({
//           type: 'candidate',
//           candidate: event.candidate,
//           roomId: this.roomId
//         }));
//       } else {
//         console.log("All ICE candidates have been sent");
//       }
//     };

//     this.peerConnection.ontrack = (event) => {
//       console.log("Remote track received:", event.track);
//       if (event.streams && event.streams.length > 0) {
//         this.remoteVideoRef.nativeElement.srcObject = event.streams[0];
//         console.log("Remote video stream is set!");
//       } else {
//         console.error("No remote streams found in the event");
//       }
//     };

//     this.peerConnection.oniceconnectionstatechange = () => {
//       console.log("ICE connection state changed:", this.peerConnection.iceConnectionState);
//     };

//     this.peerConnection.onnegotiationneeded = async () => {
//       try {
//         console.log("Negotiation is needed");
//         const offer = await this.peerConnection.createOffer();
//         await this.peerConnection.setLocalDescription(offer);
//         console.log("Offer created and set as local description:", offer);

//         this.signalingServer.send(JSON.stringify({
//           type: 'offer',
//           offer: offer,
//           roomId: this.roomId
//         }));
//       } catch (error) {
//         console.error("Error creating offer during negotiation:", error);
//       }
//     };

//     if (this.localStream) {
//       this.localStream.getTracks().forEach(track => {
//         console.log("Adding local track:", track);
//         this.peerConnection.addTrack(track, this.localStream);
//       });
//     } else {
//       console.error('No local stream available');
//     }

//     if (isCaller) {
//       this.createOffer();
//     }
//   }

//   async createOffer() {
//     try {
//       console.log("Creating offer...");
//       const offer = await this.peerConnection.createOffer();
//       await this.peerConnection.setLocalDescription(offer);
//       console.log("Offer created and set as local description:", offer);

//       this.signalingServer.send(JSON.stringify({
//         type: 'offer',
//         offer: offer,
//         roomId: this.roomId
//       }));
//     } catch (error) {
//       console.error("Error creating offer:", error);
//     }
//   }

//   async createAnswer(offer: RTCSessionDescription) {
//     try {
//       console.log("Setting remote offer:", offer);
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

//       console.log("Creating answer...");
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(answer);

//       console.log("Answer created and set as local description:", answer);

//       this.signalingServer.send(JSON.stringify({
//         type: 'answer',
//         answer: answer,
//         roomId: this.roomId
//       }));
//     } catch (error) {
//       console.error("Error creating answer:", error);
//     }
//   }

//   startCall() {
//     console.log("Starting call...");
//     this.createPeerConnection(true);
//   }

//   answerCall() {
//     console.log("Answering call...");
//     this.createPeerConnection(false);
//   }

//   sendMessage() {
//     if (this.chatMessage.trim() !== '') {
//       this.chatMessages.push(this.chatMessage);
//       this.signalingServer.send(JSON.stringify({
//         chat: this.chatMessage,
//         roomId: this.roomId
//       }));
//       this.chatMessage = '';
//     }
//   }

//   createRoom(roomId: string) {
//     if (roomId.trim() === '') {
//       console.error("Room ID is required to create a room");
//       return;
//     }
//     this.roomId = roomId;
//     this.signalingServer.send(JSON.stringify({ roomId: this.roomId }));
//     this.startCall();
//   }

//   joinRoom(roomId: string) {
//     if (roomId.trim() === '') {
//       console.error("Room ID is required to join a room");
//       return;
//     }
//     this.roomId = roomId;
//     this.signalingServer.send(JSON.stringify({ roomId: this.roomId }));
//     this.answerCall();
//   }

//   enterManualSDP() {
//     if (this.manualSDP.trim() === '') {
//       console.error("Manual SDP is required");
//       return;
//     }

//     try {
//       const sdpData = JSON.parse(this.manualSDP);
//       if (sdpData.sdp && sdpData.type === 'offer') {
//         console.log("Manual SDP offer received:", sdpData);
//         this.createPeerConnection(false);
//         this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpData));
//       } else {
//         console.error("Invalid SDP format. Ensure it includes 'sdp' and 'type'");
//       }
//     } catch (error) {
//       console.error("Failed to parse SDP:", error);
//     }
//   }

//   isMuted: boolean = false;

//   toggleMute() {
//     console.log('muted function is called');
//     this.isMuted = !this.isMuted;
//     const audioTracks = this.localStream.getAudioTracks();

//     if (audioTracks.length > 0) {
//       audioTracks[0].enabled = !this.isMuted; // Mute/unmute audio track
//     }

//     // Send mute state to the signaling server
//     this.signalingServer.send(JSON.stringify({
//       mute: true, // Adding mute type
//       muted: this.isMuted,
//       roomId: this.roomId
//     }));

//     console.log("User muted:", this.isMuted);
//   }
// }


















import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements AfterViewInit {
  localUserId: string = '';
  remoteUserId: string = '';
  roomId: string = '';
  newRoomId: string = '';
  joinRoomId: string = '';
  chatMessage: string = '';
  chatMessages: string[] = [];
  manualSDP: string = '';
  mIsRemoteUserVideoOn: boolean = true;
  mIsRemoteUserMuted: boolean = false;

  @ViewChild('localVideo') localVideoRef!: ElementRef;
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef;

  localStream!: MediaStream;
  peerConnection!: RTCPeerConnection;
  signalingServer!: WebSocket;

  pendingCandidates: RTCIceCandidate[] = []; // Moved outside to be class-level
  isVideoEnabled: boolean = true; // Track video status

  ngAfterViewInit() {
    this.setupSignalingServer();
    this.startLocalVideo();
  }

  mCreateNewCall() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 5;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    this.newRoomId = result;

    this.startLocalVideo();
    this.createRoom(this.newRoomId)
  }

  async startLocalVideo() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream = mediaStream;

      if (this.localVideoRef && this.localVideoRef.nativeElement) {
        this.localVideoRef.nativeElement.srcObject = this.localStream;
        this.localVideoRef.nativeElement.muted = true; // Mute the local audio playback
  this.localVideoRef.nativeElement.volume = 0;   // Set volume to 0 just in case

        console.log("Local video stream is set!");
      }
      if (this.newRoomId !== '') {
      }
    } catch (err) {
      console.error("Failed to get local media", err);
      alert("Failed to access your camera or microphone. Please check permissions.");
    }
  }

  setupSignalingServer() {
    this.signalingServer = new WebSocket('wss://web-socket-fuwr.onrender.com');

    this.signalingServer.onopen = () => {
      console.log("Connected to the signaling server");
    };

    this.signalingServer.onmessage = (event) => {
      this.handleSignalingMessage(event.data);
    };

    this.signalingServer.onerror = (error) => {
      console.error("WebSocket error observed:", error);
    };

    this.signalingServer.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  handleSignalingMessage(message: string) {
    const data = JSON.parse(message);

    if (data.mute !== undefined) {
      const remoteUserMuted = data.muted;
      console.log("Remote user muted:", remoteUserMuted);
      this.mIsRemoteUserMuted = remoteUserMuted;
    }

    if (data.offer) {
      console.log("Received offer:", data.offer);
      this.createPeerConnection(false);
      this.createAnswer(data.offer);
    } else if (data.answer) {
      console.log("Received answer:", data.answer);
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
        .then(() => {
          console.log("Remote description set with answer");
          this.pendingCandidates.forEach(candidate => {
            this.peerConnection.addIceCandidate(candidate).catch(error => {
              console.error("Error adding pending ICE candidate:", error);
            });
          });
          this.pendingCandidates = [];
        })
        .catch(error => {
          console.error("Error setting remote description with answer:", error);
        });
    } else if (data.candidate) {
      console.log("Received ICE candidate:", data.candidate);
      const candidate = new RTCIceCandidate(data.candidate);
      if (this.peerConnection.remoteDescription) {
        this.peerConnection.addIceCandidate(candidate).catch(error => {
          console.error("Error adding ICE candidate:", error);
        });
      } else {
        console.log("Remote description not set yet, storing candidate");
        this.pendingCandidates.push(candidate);
      }
    } else if (data.chat) {
      this.chatMessages.push(data.chat);
    } else if (data.videoStatus !== undefined) {
      console.log("Remote video status changed:", data.videoStatus);
      this.mIsRemoteUserVideoOn = data.videoStatus;
    }
  }

  createPeerConnection(isCaller: boolean) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    });

    console.log("Peer connection created:", this.peerConnection);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        this.signalingServer.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate,
          roomId: this.roomId
        }));
      } else {
        console.log("All ICE candidates have been sent");
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log("Remote track received:", event.track);
      if (event.streams && event.streams.length > 0) {
        this.remoteVideoRef.nativeElement.srcObject = event.streams[0];
        console.log("Remote video stream is set!");
      } else {
        console.error("No remote streams found in the event");
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed:", this.peerConnection.iceConnectionState);
    };

    this.peerConnection.onnegotiationneeded = async () => {
      try {
        console.log("Negotiation is needed");
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log("Offer created and set as local description:", offer);

        this.signalingServer.send(JSON.stringify({
          type: 'offer',
          offer: offer,
          roomId: this.roomId
        }));
      } catch (error) {
        console.error("Error creating offer during negotiation:", error);
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log("Adding local track:", track);
        this.peerConnection.addTrack(track, this.localStream);
      });
    } else {
      console.error('No local stream available');
    }

    if (isCaller) {
      this.createOffer();
    }
  }

  async createOffer() {
    try {
      console.log("Creating offer...");
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log("Offer created and set as local description:", offer);

      this.signalingServer.send(JSON.stringify({
        type: 'offer',
        offer: offer,
        roomId: this.roomId
      }));
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  async createAnswer(offer: RTCSessionDescription) {
    try {
      console.log("Setting remote offer:", offer);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      console.log("Creating answer...");
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      console.log("Answer created and set as local description:", answer);

      this.signalingServer.send(JSON.stringify({
        type: 'answer',
        answer: answer,
        roomId: this.roomId
      }));
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }

  startCall() {
    console.log("Starting call...");
    this.createPeerConnection(true);
  }

  answerCall() {
    console.log("Answering call...");
    this.createPeerConnection(false);
  }

  sendMessage() {
    if (this.chatMessage.trim() !== '') {
      this.chatMessages.push(this.chatMessage);
      this.signalingServer.send(JSON.stringify({
        chat: this.chatMessage,
        roomId: this.roomId
      }));
      this.chatMessage = '';
    }
  }

  createRoom(roomId: string) {
    if (roomId.trim() === '') {
      console.error("Room ID is required to create a room");
      return;
    }
    this.roomId = roomId;
    this.signalingServer.send(JSON.stringify({ roomId: this.roomId }));
    this.startCall();
  }

  joinRoom(roomId: string) {
    if (roomId.trim() === '') {
      console.error("Room ID is required to join a room");
      return;
    }
    this.roomId = roomId;
    this.signalingServer.send(JSON.stringify({ roomId: this.roomId }));
    this.answerCall();
  }

  enterManualSDP() {
    if (this.manualSDP.trim() === '') {
      console.error("Manual SDP is required");
      return;
    }

    try {
      const sdpData = JSON.parse(this.manualSDP);
      if (sdpData.sdp && sdpData.type === 'offer') {
        console.log("Manual SDP offer received:", sdpData);
        this.createPeerConnection(false);
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpData));
      } else {
        console.error("Invalid SDP format. Ensure it includes 'sdp' and 'type'");
      }
    } catch (error) {
      console.error("Failed to parse SDP:", error);
    }
  }

  isMuted: boolean = false;

  toggleMute() {
    console.log('Mute function is called');
    this.isMuted = !this.isMuted;
    const audioTracks = this.localStream.getAudioTracks();
    console.log(audioTracks);
    if (audioTracks.length > 0) {
      audioTracks[0].muted=!this.isMuted;
      audioTracks[0].enabled = !this.isMuted; // Mute/unmute audio track
    }

    this.signalingServer.send(JSON.stringify({
      mute: true,
      muted: this.isMuted,
      roomId: this.roomId
    }));

    console.log("User muted:", this.isMuted);
  }

  toggleVideo() {
    console.log('Toggle video function is called');
    this.isVideoEnabled = !this.isVideoEnabled;
    const videoTracks = this.localStream.getVideoTracks();

    if (videoTracks.length > 0) {
      videoTracks[0].enabled = this.isVideoEnabled; // Enable/disable video track
      console.log("User video status:", this.isVideoEnabled);
    }

    // Notify remote user about the video status change
    this.signalingServer.send(JSON.stringify({
      videoStatus: this.isVideoEnabled,
      roomId: this.roomId
    }));

    // Log video status on remote side
    console.log("User video toggled:", this.isVideoEnabled);
  }
}
