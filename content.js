const CHAT_SELECTORS = [
  'div[aria-label="Contacts"] a[role="link"]',
  '[aria-label="Contacts"] div[role="listitem"]',
  'div[aria-label="Active"] a[role="link"]',
  '[aria-label="Contacts"] a',
  '[aria-label="Contacts"] div[data-visualcompletion="ignore-dynamic"]',
  'div[aria-label="Contacts"] > div > div'
];

let hiddenChatsCache = [];

async function initializeChatHider() {
  console.log('Chat Hider: Initializing...');
  hiddenChatsCache = await loadHiddenChatReferences();
  console.log('Chat Hider: Loaded cache:', hiddenChatsCache.length, 'items');
  await processCurrentChats();
  observeChatListChanges();
  startPeriodicCheck();
  console.log('Chat Hider: Initialization complete');
}

async function processCurrentChats() {
  const chatElements = findAllChatElements();
  console.log('Chat Hider: Found', chatElements.length, 'chat elements');
  await hideStoredChatElements(chatElements);
  addHideButtonsToVisibleChats(chatElements);
}

function findAllChatElements() {
  const allChats = [];
  
  try {
    // Search for contact areas
    const contactAreas = document.querySelectorAll('div[aria-label="Contacts"], div[aria-label="Active"], [aria-label*="contact" i]');
    console.log('Chat Hider: Found contact areas:', contactAreas.length);
    
    if (contactAreas.length === 0) {
      console.log('Chat Hider: No contact areas found, trying fallback');
      // Fallback: look for contact-like structures anywhere
      const allLinks = document.querySelectorAll('a[role="link"]');
      console.log('Chat Hider: Found', allLinks.length, 'total links');
      
      allLinks.forEach(el => {
        if (isValidContactElement(el)) {
          allChats.push(el);
        }
      });
    } else {
      contactAreas.forEach((area, index) => {
        console.log('Chat Hider: Processing contact area', index);
        const contactItems = area.querySelectorAll('a[role="link"], div[role="listitem"], a, div[data-visualcompletion="ignore-dynamic"]');
        console.log('Chat Hider: Found', contactItems.length, 'potential items in area', index);
        
        contactItems.forEach(el => {
          if (isValidContactElement(el)) {
            allChats.push(el);
          }
        });
      });
    }
  } catch (error) {
    console.log('Chat hider: Error finding elements', error);
  }
  
  console.log('Chat Hider: Total valid contacts found:', allChats.length);
  return removeDuplicateElements(allChats);
}

function isValidContactElement(element) {
  // Skip if already has a hide button
  if (element.querySelector('.chat-hide-btn')) return false;
  
  // Check for meaningful text content (person's name)
  const text = element.textContent?.trim() || '';
  const hasName = text.length > 2 && text.length < 100 && 
                  !text.includes('Menu') && 
                  !text.includes('Search') &&
                  !text.includes('Settings') &&
                  !text.includes('Contacts');
  
  // Check for avatar/profile image
  const hasAvatar = element.querySelector('img') || 
                    element.querySelector('image') ||
                    element.querySelector('svg');
  
  // Must be clickable (link or have href)
  const isClickable = element.tagName === 'A' || 
                      element.role === 'link' || 
                      element.href;
  
  // Must be in contacts area (more flexible check)
  const isInContactArea = element.closest('div[aria-label="Contacts"]') || 
                          element.closest('div[aria-label="Active"]') ||
                          element.closest('[data-pagelet="RightRail"]') ||
                          // More flexible: if it's in a sidebar and has contact-like properties
                          (hasAvatar && hasName && isClickable);
  
  // Skip navigation elements and buttons
  if (element.closest('nav') || 
      element.getAttribute('aria-label')?.includes('Menu') ||
      element.closest('[role="navigation"]')) {
    return false;
  }
  
  const isValid = hasName && hasAvatar && isClickable && isInContactArea;
  
  if (isValid) {
    console.log('Chat Hider: Valid contact found:', text.substring(0, 30));
  }
  
  return isValid;
}

function removeDuplicateElements(elements) {
  const seen = new Set();
  return elements.filter(el => {
    // Create unique key based on text content and position
    const text = el.textContent?.trim() || '';
    const rect = el.getBoundingClientRect();
    const key = `${text}-${rect.top}-${rect.left}`;
    
    if (seen.has(key) || seen.has(el)) return false;
    seen.add(key);
    seen.add(el);
    return true;
  });
}

async function hideStoredChatElements(chatElements) {
  chatElements.forEach(chatElement => {
    if (shouldHideContactElement(chatElement, hiddenChatsCache)) {
      removeChatElement(chatElement);
    }
  });
}

function addHideButtonsToVisibleChats(chatElements) {
  chatElements.forEach(chatElement => {
    if (!shouldHideContactElement(chatElement, hiddenChatsCache)) {
      attachHideButtonToChat(chatElement);
    }
  });
}

function observeChatListChanges() {
  const observer = new MutationObserver(handleDomChanges);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

async function handleDomChanges(mutations) {
  let shouldProcess = false;
  
  mutations.forEach(mutation => {
    if (hasRelevantChanges(mutation)) {
      shouldProcess = true;
    }
  });
  
  if (shouldProcess) {
    await processCurrentChats();
  }
}

function hasRelevantChanges(mutation) {
  return Array.from(mutation.addedNodes).some(node => {
    return node.nodeType === Node.ELEMENT_NODE && 
           node.querySelector && 
           (node.closest('div[aria-label="Contacts"]') ||
            node.closest('div[aria-label="Active"]') ||
            node.querySelector('div[aria-label="Contacts"]') ||
            node.querySelector('div[aria-label="Active"]'));
  });
}

function startPeriodicCheck() {
  setInterval(async () => {
    await processCurrentChats();
  }, 3000);
}

// Start the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatHider);
} else {
  initializeChatHider();
}