# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Facebook Chat Hider is a Chrome extension (Manifest v3) that adds subtle hide buttons to Facebook contacts, allowing users to permanently hide unwanted contacts from their chat sidebar. The extension uses Chrome's local storage to persist hidden contacts across browser sessions.

## Architecture

### Core Components

**content.js** - Main orchestrator that runs on Facebook pages. Handles:
- Contact discovery using multiple CSS selectors (`CHAT_SELECTORS` array)
- DOM mutation observation for dynamic content
- Periodic re-scanning (3-second intervals)
- Comprehensive console logging with "Chat Hider:" prefix
- Fallback mechanisms when primary selectors fail

**storage.js** - Chrome storage API wrapper. Manages:
- `hiddenChats` array in `chrome.storage.local`
- Chat identification by name and href matching
- Duplicate prevention and data consistency

**ui.js** - Button creation and positioning. Handles:
- Hide button creation with `✕` symbol and CSS class `chat-hide-btn`
- Dynamic container detection and positioning
- Click event handling with preventDefault/stopPropagation

**styles.css** - Subtle styling for hide buttons:
- Positioned absolutely (top-right of contact elements)
- Semi-transparent with hover effects
- Designed to be unobtrusive

### Script Loading Order
Scripts load in sequence: `storage.js` → `ui.js` → `content.js` (per manifest.json)

### Contact Detection Strategy
Uses progressive selector strategy:
1. Primary: `div[aria-label="Contacts"]` descendants
2. Fallback: All `a[role="link"]` elements sitewide
3. Validation: Must have avatar (img/svg), meaningful text, and be clickable

## Development Commands

### Extension Development
```bash
# Package extension for distribution
python3 create_zip.py           # Creates facebook-chat-hider-v1.0.zip
./package-extension.sh          # Creates clean package directory

# Load in Chrome for testing
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked" and select project directory
```

### Debugging
Extension includes extensive console logging. Check browser console for:
- "Chat Hider: Initializing..." - Extension startup
- "Chat Hider: Found X chat elements" - Contact discovery results
- "Chat Hider: Valid contact found:" - Successful contact matches
- "Chat Hider: Attaching button to:" - UI attachment attempts

## Facebook DOM Dependencies

The extension relies on Facebook's DOM structure:
- `div[aria-label="Contacts"]` - Primary contact container
- `a[role="link"]` - Individual contact links
- Profile images and text content for validation
- Facebook's dynamic content loading patterns

When Facebook updates their DOM structure, update `CHAT_SELECTORS` array and `isValidContactElement()` validation logic.

## Key Behavioral Notes

- Extension only runs on `*://*.facebook.com/*` domains
- Uses `document_end` injection timing for complete DOM availability
- Implements mutation observer for dynamic content changes
- Stores contact data by both name and href for robust matching
- Hide buttons appear only on valid contacts (no duplicates, menus, or system elements)