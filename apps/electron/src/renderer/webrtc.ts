import { Device, types } from 'mediasoup-client';

interface WebRTCOptions {
  onConnect: () => void;
  onLog: (message: string) => void;
}
export const startWebRTC = ({ onConnect, onLog }: WebRTCOptions) => {
  const socket = new WebSocket('ws://localhost:4000');
  let device: Device;
  let sendTransport: types.Transport;
  let recvTransport: types.Transport;
  let pendingProduceCallback: ((opts: { id: string }) => void) | null = null;

  socket.onopen = () => {
    onLog('WebSocket 연결됨');
    socket.send(JSON.stringify({ type: 'getRouterRtpCapabilities' }));
  };

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    onLog(`메시지 수신: ${message.type}`);

    if (message.type === 'routerRtpCapabilities') {
      device = new Device();
      await device.load({ routerRtpCapabilities: message.data });

      socket.send(JSON.stringify({ type: 'createTransport' }));
    }

    if (message.type === 'transportCreated') {
      const transportParams: types.TransportOptions = message.data;

      sendTransport = device.createSendTransport(transportParams);

      sendTransport.on('connect', ({ dtlsParameters }, callback) => {
        socket.send(
          JSON.stringify({ type: 'connectTransport', dtlsParameters })
        );
        callback();
      });

      sendTransport.on('produce', ({ kind, rtpParameters }, callback) => {
        pendingProduceCallback = callback;
        socket.send(JSON.stringify({ type: 'produce', kind, rtpParameters }));
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const track = stream.getAudioTracks()[0];

      await sendTransport.produce({ track });

      socket.send(JSON.stringify({ type: 'createRecvTransport' }));
    }

    if (message.type === 'recvTransportCreated') {
      const { id, iceParameters, iceCandidates, dtlsParameters } = message.data;

      recvTransport = device.createRecvTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
      });

      recvTransport.on('connect', ({ dtlsParameters }, callback) => {
        socket.send(
          JSON.stringify({ type: 'connectRecvTransport', dtlsParameters })
        );
        callback();
      });

      socket.send(
        JSON.stringify({
          type: 'consume',
          rtpCapabilities: device.rtpCapabilities,
        })
      );
    }

    if (message.type === 'produced') {
      if (pendingProduceCallback) {
        pendingProduceCallback({ id: message.id });
        pendingProduceCallback = null;
      }
    }

    if (message.type === 'consumed') {
      const { id, producerId, kind, rtpParameters } = message.data;

      const consumer = await recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });

      const stream = new MediaStream([consumer.track]);
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();

      onConnect();
    }
  };
};
