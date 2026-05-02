<p align="center">
  <img src="public/icon128.png" width="74" height="74" alt="7DE Logo">
</p>

<h1 align="center">7DE - 7TV Discord Emotes</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.0-gold?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Platform-Chromium-black?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Platform-BetterDiscord-5865F2?style=flat-square" alt="BetterDiscord">
</p>

<p align="center">
  <i>A lightweight tool to find and send 7TV emotes in Discord - available as a browser extension and a BetterDiscord plugin.</i>
</p>

<div align="center">
  <img src="assets/demo-global-search.gif" width="800" alt="7de global search demo">
</div>

## What's New in v1.2.0 <img src="https://cdn.7tv.app/emote/01EZTCN91800012PTN006Q50PR/1x.avif" width="28" style="vertical-align: middle;">
- **BetterDiscord Support:** 7DE is now available as a BD plugin.

## How it works <img src="https://cdn.7tv.app/emote/01F6MCJXNG0005TFYTWP1V6W22/1x.avif" width="28" style="vertical-align: middle;">
When you select an emote from the 7DE menu, 7DE **automatically inserts** the emote URL into the chat input and **sends the message**. Discord's **Link Preview** handles the rest, rendering the URL as an image.

## Features <img src="https://cdn.7tv.app/emote/01H40TE5SR0000CP2A4HVNXW5Q/1x.avif" width="28" style="vertical-align: middle;">
- **Global Search:** Search the entire 7TV emote library.
- **Dual Search Mode:** Switch between local channel emotes and Global 7TV search.
- **One-Click Send:** Instant url-emote delivery to the chat.
- **Size Selector:** Choose between 1x, 2x, 3x, or 4x scaling.
- **Native Integration:** Minimalist button injected directly into the Discord toolbar.

<img src="assets/demo.gif" width="800" alt="7de local search demo">

> **Technical Note:**
> Emote rendering depends on **local user settings**. If someone has **Link Previews** disabled in Discord, they will only see the raw link instead of the image.

## Installation <img src="https://cdn.7tv.app/emote/01FCGQ1HF00009035XEZ39B15F/1x.avif" width="28" style="vertical-align: middle;">
### Browser Extension (Chromium-based browsers)
1. Download `7DE-extension.zip` from [Releases](../../releases).
2. Extract the archive.
3. Go to the extensions page (`chrome://extensions/` or equivalent).
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted folder.

### BetterDiscord Plugin
1. Download `7DE.plugin.js` from [Releases](../../releases).
2. Move the file to your BD plugins folder:
   - Windows: `%appdata%\BetterDiscord\plugins\`
3. In Discord, go to **Settings → Plugins** and enable **7DE**.

## Usage <img src="https://cdn.7tv.app/emote/01F6N2GFVR000F76KNAAVCSDGX/1x.avif" width="28" style="vertical-align: middle;">
1. Set your Twitch nickname:
   - **Browser Extension:** click the 7DE icon in your browser toolbar.
   - **BetterDiscord:** go to Settings → Plugins → 7DE → ⚙️.
2. In Discord, open any chat and click the **7DE button** in the message box.
3. Search for an emote and click it to send.

<img src="assets/popup-preview.png" width="333" alt="7de popup preview">

## Potential Issues <img src="https://cdn.7tv.app/emote/01EZPG1FN80001SNAW00ADK2DY/1x.avif" width="28" style="vertical-align: middle;">
- **Discord Updates:** If the button disappears or stops working, Discord likely updated its internal UI classes.

## Disclaimer <img src="https://cdn.7tv.app/emote/01FB2TYZZR000FFZEHGR57VJXJ/1x.avif" width="28" style="vertical-align: middle;">
**7DE** is an unofficial community project. It is not affiliated with, authorized, or endorsed by **Discord Inc. or 7TV.**