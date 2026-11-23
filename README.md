# MZM-WORKS — FiveM Loading Screen

A premium, responsive FiveM loading-screen resource with real FiveM load progress events and a manual NUI shutdown flow.

## Installation

1. Place this resource in your server's `resources/[local]/mzm_loading` directory.
2. Add `ensure mzm_loading` to `server.cfg`.
3. Restart the server or run `ensure mzm_loading`.

## Configuration

Edit `html/config.js` for server name, Discord links, staff, social media, loading messages, and media paths.

Place optional local assets in `html/assets/`:

- `background.jpg` — static fallback background
- `background.mp4` — optional looping background video
- `music.mp3` — optional music track

The resource supports both static background images and looping videos. JPG, PNG, WebM, MP4, and MP3 assets can be used according to their browser codec support.

## Customization

Modify `html/styles.css` for colors and layout. The loading page is responsive for desktop and mobile resolutions.

## Important

Update placeholder Discord and website URLs before deployment.
