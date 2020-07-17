/**
 * @fileoverview Type definitions for Shaka Player.
 *
 * Only APIs used by the app are included.
 */

declare namespace shaka {
    // @see {@link https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html}
    class Player {
      constructor(mediaElement: HTMLMediaElement);
  
      getNetworkingEngine(): shaka.net.NetworkingEngine;
      load(manifestUri: string, startTime?: number): Promise<void>;
    }
  }
  
  declare namespace shaka.net {
    // @see {@link https://shaka-player-demo.appspot.com/docs/api/shaka.net.NetworkingEngine.html}
    class NetworkingEngine {
      registerRequestFilter(
          filter: (type: NetworkingEngine.RequestType, request: ShakaRequest) =>
              void): void;
    }
  
    module NetworkingEngine {
      // @see {@link https://shaka-player-demo.appspot.com/docs/api/shaka.net.NetworkingEngine.html#RequestType}
      enum RequestType {
        SEGMENT,
      }
    }
  }
  
  // @see {@link https://shaka-player-demo.appspot.com/docs/api/shakaExtern.html#Request}
  declare interface ShakaRequest {
    uris: string[];
    allowCrossSiteCredentials: boolean;
  }
  