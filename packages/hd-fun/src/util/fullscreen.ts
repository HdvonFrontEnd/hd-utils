/**
 * Store the browser-specific methods for the fullscreen API.
 *
 * @type {Object}
 * @see [Specification]{@link https://fullscreen.spec.whatwg.org}
 * @see [Map Approach From Screenfull.js]{@link https://github.com/sindresorhus/screenfull.js}
 */
class FullScreen {
  readonly requestFullscreen: string;
  readonly exitFullscreen: string;
  readonly fullscreenElement: string;
  readonly fullscreenEnabled: string;
  readonly fullscreenchange: string;
  readonly fullscreenerror: string

  constructor() {
    const apiMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      // Mozilla
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      // Microsoft
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ]

    const specApi = apiMap[0]
    let browserApi

    for (let i = 0; i < apiMap.length; i++) {
      if (apiMap[i][1] in document) {
        browserApi = apiMap[i]
        break
      }
    }

    if (browserApi) {
      for (let i = 0; i < browserApi.length; i++) {
        this[specApi[i]] = browserApi[i]
      }
    }
  }
}

export {
  FullScreen
}
