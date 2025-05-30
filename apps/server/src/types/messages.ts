import type {
  RtpParameters,
  MediaKind,
  DtlsParameters,
  RtpCapabilities,
} from 'mediasoup/node/lib/types';

export type Message =
  | {
      type: 'join';
      roomId: string;
      userInfo: {
        id: string;
        name: string;
        role: string;
        profileImageUrl?: string;
      };
    }
  | { type: 'getRouterRtpCapabilities' }
  | { type: 'createTransport' }
  | { type: 'connectTransport'; dtlsParameters: DtlsParameters }
  | {
      type: 'produce';
      kind: MediaKind;
      rtpParameters: RtpParameters;
    }
  | {
      type: 'createRecvTransport';
    }
  | {
      type: 'connectRecvTransport';
      dtlsParameters: DtlsParameters;
    }
  | {
      type: 'consume';
      rtpCapabilities: RtpCapabilities;
    }
  | { type: 'disconnect'; userId: string };
