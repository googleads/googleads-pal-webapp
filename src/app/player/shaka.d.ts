/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  