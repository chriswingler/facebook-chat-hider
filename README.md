# Facebook Chat Hider

Chrome extension that adds 'X' buttons to Facebook chat elements for hiding unwanted contacts.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. Navigate to Facebook and refresh the page

## Usage

- Small 'X' buttons appear on chat elements
- Click 'X' to hide a contact permanently
- Hidden contacts remain hidden across browser sessions
- Works on Facebook messaging interface

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main logic (200 lines)
- `storage.js` - Storage operations (100 lines)  
- `ui.js` - UI creation (150 lines)
- `styles.css` - Minimal styling