(function () {
  'use strict';

  // --- 1. Fake Common Ad Network Global Objects ---
  const dummyAdArray = [];
  dummyAdArray.loaded = true;
  dummyAdArray.push = function () {
    return dummyAdArray.length;
  };

  // Mock Google AdSense / AdManager
  try {
    Object.defineProperty(window, 'adsbygoogle', {
      get: () => dummyAdArray,
      set: () => {},
      configurable: true,
    });
  } catch (e) {}

  // Mock detection flags commonly used by inline bait scripts
  try {
    Object.defineProperty(window, 'canRunAds', {
      get: () => true,
      set: () => {},
      configurable: true,
    });
    Object.defineProperty(window, 'isAdBlockActive', {
      get: () => false,
      set: () => {},
      configurable: true,
    });
  } catch (e) {}

  // --- 2. Spoof Bait Element Dimensions ---
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    const className = typeof this.className === 'string' ? this.className.toLowerCase() : '';
    const id = typeof this.id === 'string' ? this.id.toLowerCase() : '';

    const isBait =
      className.includes('adsbox') ||
      className.includes('ad-unit') ||
      className.includes('pub_300x250') ||
      id.includes('google_ads') ||
      id.includes('banner-ad');

    if (isBait) {
      return {
        width: 300,
        height: 250,
        top: 0,
        left: 0,
        bottom: 250,
        right: 300,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    }
    return originalGetBoundingClientRect.apply(this, arguments);
  };

  // --- 3. Observer to Kill Anti-Adblock Overlays & Scroll Locks ---
  const killOverlays = () => {
    // Restore scrolling and remove blur filter from body/html
    if (document.body) {
      if (document.body.style.overflow === 'hidden') document.body.style.overflow = 'auto';
      if (document.body.style.filter.includes('blur')) document.body.style.filter = 'none';
    }
    if (document.documentElement && document.documentElement.style.overflow === 'hidden') {
      document.documentElement.style.overflow = 'auto';
    }

    // Common overlay selectors used by paywalls & adblock banners
    const selectors = [
      '[id*="anti-adblock"]',
      '[class*="anti-adblock"]',
      '[id*="adblock-modal"]',
      '[class*="adblock-modal"]',
      '[id*="adblock-detector"]',
      '.adblock-overlay',
      '.adblocker-backdrop'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((el) => {
      el.remove();
    });
  };

  const observer = new MutationObserver(killOverlays);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', killOverlays);
})();
