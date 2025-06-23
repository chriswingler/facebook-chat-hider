const STORAGE_KEY = 'hiddenChats';

async function loadHiddenChatReferences() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || [];
}

async function saveHiddenChatReference(chatData) {
  const hiddenChats = await loadHiddenChatReferences();
  const newEntry = createChatEntry(chatData);
  
  if (!isDuplicate(hiddenChats, newEntry)) {
    hiddenChats.push(newEntry);
    await chrome.storage.local.set({ [STORAGE_KEY]: hiddenChats });
  }
}

async function removeHiddenChatReference(chatData) {
  const hiddenChats = await loadHiddenChatReferences();
  const filteredChats = hiddenChats.filter(chat => 
    !isSameChat(chat, chatData)
  );
  await chrome.storage.local.set({ [STORAGE_KEY]: filteredChats });
}

function createChatEntry(chatData) {
  return {
    name: chatData.name,
    href: chatData.href,
    timestamp: Date.now()
  };
}

function isDuplicate(hiddenChats, newEntry) {
  return hiddenChats.some(chat => isSameChat(chat, newEntry));
}

function isSameChat(chat1, chat2) {
  return chat1.href === chat2.href || chat1.name === chat2.name;
}

function extractChatData(chatElement) {
  const link = chatElement.querySelector('a[href*="/messages/"]') ||
               chatElement.querySelector('a[href*="/t/"]') ||
               chatElement.querySelector('a[role="link"]');
  
  const nameElement = chatElement.querySelector('span[dir="auto"]') ||
                      chatElement.querySelector('span[class*="x193iq5w"]') ||
                      chatElement.querySelector('span');
  
  // Fallback: extract name from text content
  let name = nameElement?.textContent?.trim() || '';
  if (!name && chatElement.textContent) {
    const text = chatElement.textContent.trim();
    // Extract the main name (usually the longest text segment)
    const lines = text.split('\n').filter(line => line.trim().length > 2);
    name = lines[0] || text.substring(0, 50);
  }
  
  return {
    name: name,
    href: link?.getAttribute('href') || chatElement.href || ''
  };
}