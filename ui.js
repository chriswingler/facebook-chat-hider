function createHideButton() {
  const button = document.createElement('button');
  button.className = 'chat-hide-btn';
  button.innerHTML = '✕';
  button.title = 'Hide this chat';
  return button;
}

function attachHideButtonToChat(chatElement) {
  if (hasHideButton(chatElement)) return;
  
  console.log('Chat Hider: Attaching button to:', chatElement.textContent?.trim().substring(0, 30));
  const button = createHideButton();
  attachClickHandler(button, chatElement);
  positionButton(button, chatElement);
}

function attachClickHandler(button, chatElement) {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await handleHideButtonClick(chatElement);
  });
}

async function handleHideButtonClick(chatElement) {
  const chatData = extractChatData(chatElement);
  await saveHiddenChatReference(chatData);
  removeChatElement(chatElement);
}

function positionButton(button, chatElement) {
  const container = getButtonContainer(chatElement);
  if (container) {
    console.log('Chat Hider: Positioning button in container');
    container.style.position = 'relative';
    container.appendChild(button);
    console.log('Chat Hider: Button attached successfully');
  } else {
    console.log('Chat Hider: No container found for button');
  }
}

function getButtonContainer(chatElement) {
  // For contact lists, try to find the main container
  const containers = [
    'a[role="link"]',
    'a[href*="/messages/"]',
    'a[href*="/t/"]', 
    'div[class*="x1i10hfl"]',
    'div[class*="x1n2onr6"]',
    'div[class*="x9f619"]',
    'div'
  ];
  
  for (const selector of containers) {
    const container = chatElement.querySelector(selector);
    if (container) return container;
  }
  
  // If chatElement itself is a link or container, use it
  if (chatElement.tagName === 'A' || chatElement.role === 'link') {
    return chatElement;
  }
  
  return chatElement;
}

function removeChatElement(chatElement) {
  const listItem = chatElement.closest('li');
  if (listItem) {
    listItem.remove();
  } else {
    chatElement.remove();
  }
}

function hasHideButton(chatElement) {
  return chatElement.querySelector('.chat-hide-btn') !== null;
}

function shouldHideContactElement(contactElement, hiddenChats) {
  const contactData = extractChatData(contactElement);
  return hiddenChats.some(hidden => isSameChat(hidden, contactData));
}