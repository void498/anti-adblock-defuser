# Anti-Adblock Defuser 🛡️

A lightweight, client-side Chromium extension built on **Manifest V3** that neuters anti-adblock detection scripts, spoofs ad network globals, and automatically removes aggressive overlay modals and scroll locks.

---

## ⚡ How It Works

Websites primarily detect ad blockers through three vectors:
1. **Ad Provider Globals:** Inspecting runtime variables like `window.adsbygoogle` or `window.canRunAds`.
2. **Bait Element Sizing:** Checking if dummy ad containers (`.ad-banner`, `.adsbox`) have been collapsed to zero height/width.
3. **Modal Injectors:** Blurring the document body, locking overflow scrolling, and popping up dialogs demanding ad-block disabling.

**Anti-Adblock Defuser** neutralizes these checks directly within the page's execution context (`world: "MAIN"`):
* Stubs common ad provider queues and sets detection boolean flags to persistent truthful states.
* Overrides `Element.prototype.getBoundingClientRect` to return positive dimensions (300×250) for known ad-bait elements.
* Runs a persistent `MutationObserver` to strip blur filters, unlock body scroll locks, and eliminate blocker backdrop modals on appearance.

---

## 📁 Project Structure

```text
anti-adblock-defuser/
├── manifest.json   # Manifest V3 extension configuration
├── defuser.js      # Main-world script for spoofing and DOM defusing
└── popup.html      # Lightweight toolbar status card
