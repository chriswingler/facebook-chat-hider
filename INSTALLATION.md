# Facebook Chat Hider - Installation Guide

## Method 1: Load as Unpacked Extension (Recommended for Testing)

This is the easiest way to install and test the extension:

### Steps:
1. **Download the extension files**:
   - Clone the repository: `git clone https://github.com/chriswingler/facebook-chat-hider.git`
   - Or download as ZIP from GitHub and extract

2. **Open Chrome Extensions page**:
   - Go to `chrome://extensions/` in your browser
   - Or click Chrome menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**:
   - Click "Load unpacked" button
   - Navigate to the `facebook-chat-hider` folder
   - Select the folder and click "Select Folder"

5. **Verify installation**:
   - The extension should appear in your extensions list
   - Visit facebook.com and check the contacts sidebar for hide buttons

### To share with others:
- Send them this repository link: https://github.com/chriswingler/facebook-chat-hider
- They can follow the same steps above

## Method 2: Create .crx Package

For easier sharing without requiring developer mode:

### Create the package:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select the extension folder
5. Click "Pack Extension" (leave private key field empty for first time)
6. This creates a `.crx` file and `.pem` key

### Share the .crx file:
- Users can drag and drop the `.crx` file onto their `chrome://extensions/` page
- Note: Chrome may show security warnings for non-store extensions

## Method 3: Chrome Web Store (Most Professional)

For wide distribution:

1. **Prepare for submission**:
   - Create promotional images (128x128 icon, screenshots)
   - Write detailed description
   - Test thoroughly

2. **Submit to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay $5 one-time developer fee
   - Upload extension package
   - Fill out store listing details
   - Submit for review (takes 1-3 days)

## Troubleshooting

- **Extension not working**: Check console for "Chat Hider:" log messages
- **Buttons not appearing**: Refresh Facebook page after installing
- **Permission issues**: Make sure extension has access to facebook.com

## Security Note

This extension only runs on Facebook pages and stores hidden contact preferences locally. It does not send data to external servers or access sensitive information.